export interface TableItemData {
  name: string;
  key: string;
  path: string;
  dbPath: string;
  base: string; // 文档基础路径
}

export const DB_ID = 'db-setting-id'
type DbIdType = typeof DB_ID;

export interface DbData {
  data: TableItemData[];
  _id: DbIdType;
  _rev?: string;
}

// 进入 utools 之后传入的数据
export interface CurEnvData {
  code: string;
  type: string;
}
