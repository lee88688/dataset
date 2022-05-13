import { toRaw } from "vue";
import { DB_ID, TableItemData } from "./interfaces";

export class DBData {
  data: TableItemData[]
  _id: string
  _rev?: string

  constructor() {
    this.data = [];
    this._id = DB_ID;
  }

  private commitData() {
    const res = utools.db.put({
      data: toRaw(this.data),
      _id: this._id,
      _rev: this._rev
    })
    this._rev = res.rev;
  }

  addItem(item: TableItemData) {
    this.data.push(item)
    this.commitData()
    utools.setFeature({
      code: item.key,
      platform: ['win32'],
      explain: `${item.name}`,
      cmds:[item.key]
    })
  }

  deleteItem(index: number) {
    if (!(index in this.data)) return
    const key = this.data[index].key
    this.data.splice(index, 1)
    this.commitData()
    utools.removeFeature(key)
  }

  readData() {
    const data = utools.db.get(this._id);
    if (!data) {
      this.commitData()
    } else {
      this._id = data._id
      this._rev = data._rev
      this.data = data.data
    }
  }

  findByKey(key: string) {
    for (const item of this.data) {
      if (key === item.key) return item;
    }
  }
}