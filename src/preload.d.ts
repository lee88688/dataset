// preload 定义的函数

declare async function resolveDataset(base: string): { dbPath: string, base: string };

interface DBItem {
  name: string;
  type: string;
  path: string;
}

declare async function searchDb(dbPath: string, key: string): DBItem[];

declare async function getHTMLPath(base: string, url: string);