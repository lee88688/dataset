// 搜索相关的代码

async function searchDataset(pattern) {
  if (currentMode !== 'search') return
  const { dbPath } = currentDbData
  const result = await window.searchDb(dbPath, pattern)
  $('.dataset .aside .list-group').html(result.map(({ name, type, path}, index) => {
    return `
    <a class="list-group-item list-group-item-action" id=${`list-${index}`} onclick="listItemClick('${`list-${index}`}', '${path}')">
      <div class="h6">${name}</div>
      <small class="text-muted">${type}</small>
    </a>
    `
  }).join('\n'))
}

function listItemClick(id, path) {
  const { base } = currentDbData
  const { url } = window.getHTMLPath(base, path)
  $('#docFrame').prop('src', url)
  $('.dataset .aside .list-group-item.active').removeClass('active')
  $(`#${id}`).addClass('active')
}

function searchInit() {
  if (currentMode !== 'search') {
    utools.removeSubInput()
    return
  }
  searchDataset('')
  const debounceSearch = _.debounce(searchDataset, 200)
  utools.setSubInput(({ text }) => {
    debounceSearch(text)
  })
}

$(function() {
  $(document).on('pluginEnter', searchInit)
})
