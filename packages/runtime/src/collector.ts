import { EventEmitter } from 'eventemitter3';
import {
  CollectorInstanceInfo,
  Loc,
  ComponentMetaData,
  utils,
  VIRTUAL_LOC,
} from '@relyzer/shared';
import CollectorFrame from './frame';
import UpdateCounter from './update-counter';

const { log, warn } = console;

let incId = -1;

let incLogValId = -1;

export default class Collector extends EventEmitter {
  $$typeof = 'relyzer';

  id = incId += 1;

  frameIncId = -1;

  pendingFrame: CollectorFrame | null = null;

  createdAt = performance.now();

  enabled = false;

  updatedTimes = 0;

  frames: CollectorFrame[] = [];

  varUpdateCounter = new UpdateCounter<number>();

  propsUpdateCounter = new UpdateCounter<string>();

  loc?: Loc;

  constructor(public component: ComponentMetaData) {
    super();
    this.loc = component.loc == null ? undefined : utils.parseLoc(component.loc);
  }

  public get code() {
    return this.component.code;
  }

  /**
   * 启用 / 禁用
   */
  enable(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * start frame
   */
  start() {
    const frameId = (this.frameIncId += 1);
    const frame = new CollectorFrame(frameId, this.id);
    this.pendingFrame = frame;
  }

  /**
   * finish frame
   * @todo consider move to class CollectorFrame
   */
  flush() {
    if (!this.pendingFrame) {
      return;
    }

    const { pendingFrame } = this;
    let props: Record<string, any> = {};

    for (const [loc, value] of pendingFrame.records) {
      if (loc === VIRTUAL_LOC.PROPS) {
        for (const prop of Object.keys(value)) {
          this.propsUpdateCounter.set(prop, value[prop]);
        }
        props = value;
      } else {
        this.varUpdateCounter.set(loc, value);
      }
    }

    const { updateKeys, updatedTimes } = this.varUpdateCounter.submit();
    const { updateKeys: updatedProps, updatedTimes: propsUpdatedTimes } = this.propsUpdateCounter.submit();

    pendingFrame.updatedTimes = updatedTimes;
    pendingFrame.updatedIds = updateKeys;
    pendingFrame.props = props;
    pendingFrame.updatedProps = updatedProps;
    pendingFrame.propsUpdatedTimes = propsUpdatedTimes;

    this.frames.push(pendingFrame);
    this.pendingFrame = null;
    this.updatedTimes += 1;
    this.emit('frame', { pendingFrame, updatedTimes });
  }

  /**
   * 记录一个数据
   */
  record(index: number, value: any) {
    this.pendingFrame?.record(index, value);
  }

  /**
   * 清空栈，释放内存
   */
  clear() {
    this.frames = [];
  }

  /**
   * 获取最新帧
   */
  get latestFrame() {
    return this.frames[this.frames.length - 1];
  }

  /**
   * 将某个值打印到 Console
   * @param frameId frame id
   * @param loc 值位置
   */
  inspectValue(frameId: number, loc: number) {
    const frame = this.frames.find((f) => f.id === frameId);
    const hasRecord = frame?.records.has(loc);
    const record = frame?.records.get(loc);
    if (!hasRecord) {
      warn('找不到值');
      return;
    }

    const id = `val${incLogValId += 1}`;
    log('%c❯ print', 'color: blue', `${id}:`);
    log(record);
    (globalThis as any)[id] = record;
  }

  toPlain(): CollectorInstanceInfo {
    return {
      ...utils.pick(this, 'id', 'component', 'updatedTimes'),
      latestFrame: this.latestFrame?.toPlain(),
    };
  }
}
