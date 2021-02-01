export default class UpdateCounter<Key extends (string | number | symbol)> {
  updatedTimes: Record<Key, number> = {} as any;

  updateKeys: Array<Key> = [];

  values = new Map<Key, any>();

  set(key: Key, value: any) {
    const hasPrevRecord = this.values.has(key);
    const prevRecord = this.values.get(key);
    if (
      !hasPrevRecord
      || !Object.is(prevRecord, value)
    ) {
      this.updatedTimes[key] = (this.updatedTimes[key] || 0) + 1;
      this.updateKeys.push(key);
    }

    // TODO: record removal

    this.values.set(key, value);
  }

  submit() {
    const { updatedTimes, updateKeys } = this;
    this.updatedTimes = { ...updatedTimes };
    this.updateKeys = [];

    return { updatedTimes, updateKeys };
  }
}
