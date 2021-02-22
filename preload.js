const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
const fsPromise = require('fs').promises
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

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
  const result = await db.all(`select name, type, path from searchIndex where name like '%${key}%' limit 100`)
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
