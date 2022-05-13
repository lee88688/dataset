if (!('utools' in window)) {
  console.log('utools mock api start')
  let rev = 0
  const u = {
    db: {
      put(argv: any) {
        return { _rev: rev++ }
      },
      get(argv: any) { console.log('utools.db.get', argv) }
    },
    onPluginEnter(fn: any) {
      fn({ code: '', type: '' })
    }
  }

  window.utools = u as any;
  window.resolveDataset = function(base: string) {
    return {
      dbPath: base,
      docBasePath: base,
    }
  } as any
}

export {}