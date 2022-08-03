const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
const fsPromise = require('fs').promises
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

let tableInfo = new Map()

// 解析数据集所在的文件夹
window.resolveDataset = async function(base) {
  // const metaString = await fsPromise.readFile(path.resolve(base, 'meta.json'), { encoding: 'utf8' })
  const dbPath = path.resolve(base, 'Contents/Resources/docSet.dsidx')
  if (!fs.existsSync(dbPath)) {
    throw new Error("can't find docSet.dsidx!")
  }

  return {
    dbPath,
    base: path.resolve(base, 'Contents/Resources/Documents')
  }
}

window.searchDb = async function(dbPath, key) {
  const db = await open({ filename: dbPath, driver: sqlite3.Database })

  let tableNames
  if (!tableInfo.has(dbPath)) {
    const info = await db.all(`PRAGMA table_info(searchIndex)`)
    tableNames = info.map(({ name }) => name)
    // console.log(tableNames)
    tableInfo.set(dbPath, tableNames)
  } else {
    tableNames = tableInfo.get(dbPath)
  }

  const result = await db.all(`select ${tableNames.join(',')} from searchIndex where name like '%${key}%' order by length(name) limit 100`)
  result.forEach(v => {
    v.path = v.fragment ? `${v.path}#${v.fragment}` : v.path
  })
  await db.close()
  return result
}

window.getHTMLPath = function(base, url) {
  let filePath = ''
  let sharpStr = ''
  const options = {}
  const sharpIndex = url.indexOf('#')
  if (sharpIndex >= 0) {
    filePath = url.slice(0, sharpIndex)
    sharpStr = url.slice(sharpIndex)
  } else {
    filePath = url
  }
  const reg = /<(\S+?)=(\S+?)>/g
  for (let matchArr of filePath.matchAll(reg)) {
    options[matchArr[1]] = querystring.unescape(matchArr[2])
  }
  console.log(options)
  filePath = filePath.replace(reg, '')
  const fileUrl = path.resolve(base, filePath) + sharpStr
  return {
    url: fileUrl,
    ...options
  }
}
