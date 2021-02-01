import fromPairs from 'lodash/fromPairs';
import mapValue from 'lodash/mapValues';
import { utils, ObjectSummary, PlainCollectorFrame } from '@relyzer/shared';

const objectDesc = (obj: any): ObjectSummary => {
  const type = typeof obj;

  if (obj === null || type !== 'object') {
    return [
      typeof obj,
      type === 'function'
        ? obj.name
        : obj,
    ];
  }

  if (Array.isArray(obj)) {
    return ['array', obj.length];
  }

  return ['object', null];
};

export default class CollectorFrame {
  constructor(
    public readonly id: number,
    public readonly pid: number,
  ) {}

  createdAt = performance.now();

  /**
   * the locs value
   */
  records = new Map<number, any>();

  /**
   * total update times
   */
  updatedTimes: Record<number, number> = {};

  /**
   * updated locs
   */
  updatedIds: number[] = [];

  // eslint-disable-next-line react/static-property-placement
  props: Record<string, any> = {};

  /**
   * updated props
   */
  updatedProps: string[] = [];

  /**
   * props update times
   */
  propsUpdatedTimes: Record<string, number> = {};

  record(loc: number, val: any) {
    this.records.set(loc, val);
  }

  toPlain(): PlainCollectorFrame {
    return {
      ...utils.pick(
        this,
        'id',
        'pid',
        'createdAt',
        'updatedIds',
        'updatedTimes',
        'updatedProps',
        'propsUpdatedTimes',
      ),
      props: mapValue(this.props, objectDesc),
      records: fromPairs(Array.from(this.records).map(([key, val]) => [key, objectDesc(val)])),
    };
  }
}
