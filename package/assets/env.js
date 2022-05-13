var currentMode = ''
var currentDbData = null
var dbId = 'db-setting-id'
var dbData = { data: [], _id: dbId }

function updateDbData() {
  const res = utools.db.put(dbData)
  dbData._rev = res.rev
}

function ready(e, { code, type, payload, optional }) {
  console.log('env.js')
  let data = utools.db.get(dbId)
  if (!data) {
    data = utools.db.put(dbData)
    dbData._rev = data.rev
  } else {
    dbData = data
  }

  if (code === 'dataset') {
    $('.setting').addClass('show')
    $('.dataset').removeClass('show')
    currentMode = 'setting'
    currentDbData = null
  } else {
    $('.setting').removeClass('show')
    $('.dataset').addClass('show')
    currentMode = 'search'
    currentDbData = dbData.data.find(({ key }) => key === code)
  }
}

utools.onPluginReady(() => {
  $(document).trigger('pluginReady')
})

utools.onPluginEnter((e) => {
  $(document).trigger('pluginEnter', [e])
})

$(function() {
  $(document).on('pluginEnter', ready)
})
