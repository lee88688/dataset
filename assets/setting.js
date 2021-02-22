// 设置相关代码

// 添加一个文档数据库
async function addItem() {
  let itemObj = {}
  let errorMsg = ''
  $('.setting input').each(function() {
    const key = this.id.split('-')[1]
    const value = this.value
    if (!value) {
      errorMsg = '输入未填写完成'
    }
    itemObj[key] = value
  })

  if (dbData.data.some(({ key }) => key === itemObj.key)) {
    errorMsg = '输入key不能与已有的key重复'
  }

  // check input
  const alert = $('#setting-alert')
  if (errorMsg) {
    alert.text(errorMsg)
    alert.toggle(true)
    return
  } else {
    alert.toggle(false)
  }

  // check dir 
  let meta = {}
  try {
    meta = await window.resolveDataset(itemObj.dir)
  } catch(e) {
    alert.text(e.toString())
    alert.toggle(true)
    return
  }
  itemObj = { ...itemObj, ...meta }

  utools.setFeature({
    code: itemObj.key,
    explain: `${itemObj.name}`,
    cmds:[itemObj.key]
  })

  dbData.data.push(itemObj)
  updateDbData()

  displaySettingData()
  $('.setting input').prop('value', '')
}

function deleteItem(index) {
  const dataList = dbData.data || []
  if (!(index in dataList)) {
    return
  }
  const delData = dataList[index]
  dataList.splice(index, 1)
  updateDbData()
  utools.removeFeature(delData.key)
  displaySettingData()
}

function displaySettingData() {
  const dataList = dbData.data || []
  const tbody = $('.setting > table tbody')
  tbody.html(dataList.map(({ key, name, dir }, index) => {
    return `
    <tr>
      <td>${index}</td>
      <td>${name}</td>
      <td>${key}</td>
      <td>${dir}</td>
      <td><button class="btn btn-danger" onclick="deleteItem(${index})">删除</button></td>
    </tr>
    `
  }).join('\n'))
}

$(function() {
  $('#add-item').click(addItem)
  $(document).on('pluginEnter', displaySettingData)
})
