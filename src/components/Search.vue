<template>
  <section class="search">
    <aside :class="isContentSearch ? 'hide' : ''">
      <ul class="list-group">
        <a
          v-for="(item, index) in list"
          :key="index"
          class="list-group-item list-group-item-action"
          :class="index === activeIndex ? 'active' : ''"
          :tabindex="index"
          @click="itemClick(index, item.path)"
        >
          <div class="h5">{{item.name}}</div>
          <small class="text-muted">{{item.type}}</small>
        </a>
      </ul>
    </aside>
    <main>
      <iframe ref="iframe" tabindex="-1" :src="iframeSrc" />
    </main>
  </section>
</template>

<script setup lang="ts">
import { useEventBus, watchOnce } from '@vueuse/core';
import debounce from 'lodash/debounce'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
// import Mark from 'mark.js'
import { DBData } from '../DBData';
import { CurEnvData, TableItemData } from '../interfaces';
import { onPluginEnterKey } from '../utools-event-bus';

defineOptions({
  name: "Search"
})

const props = defineProps<{
  dbData: DBData,
  envData?: CurEnvData
}>()

const list = ref<DBItem[]>([])
const activeIndex = ref(-1)

// const curDbItem = ref<TableItemData>()
const curDbItem = computed(() => {
  if (props.envData) {
    const { code } = props.envData
    const item = props.dbData.findByKey(code)
    return item
  }
})

const iframe = ref<HTMLIFrameElement>()
const iframeSrc = ref('')

const searchParams = reactive({ databaseStr: '', contentStr: '' })
const isContentSearch = ref(false)

let isFinding = false

// 在搜索框中可以使用 Tab 键进行导航
const onTabKeyUp = (e: KeyboardEvent) => {
  console.log(e)
  if (isFinding) {
    switch(e.key) {
      case 'Enter':
      case 'Tab':
      case 'ArrowDown': {
        utools.findInPage(searchParams.contentStr, { findNext: true })
        break
      }
      case 'ArrowUp': {
        utools.findInPage(searchParams.contentStr, { findNext: true, forward: false })
        break
      }
    }
    e.preventDefault()
    return
  }

  let nextIndex: number
  switch(e.key) {
    case 'Tab':
    case 'ArrowDown': {
      nextIndex = activeIndex.value + 1
      break
    }
    case 'ArrowUp': {
      nextIndex = activeIndex.value - 1
      break
    }
    default:
      return
  }
  e.preventDefault()
  e.stopPropagation()
  if (!(nextIndex in list.value)) return
  itemClick(nextIndex, list.value[nextIndex].path)
}
onMounted(() => {
  window.addEventListener('keydown', onTabKeyUp)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onTabKeyUp)
})

const itemClick = (index: number, path: string) => {
  const { url } = window.getHTMLPath(curDbItem.value!.base, path)
  iframeSrc.value = url
  activeIndex.value = index
  // console.log('path: ', path)
}

watchOnce(iframe, () => {
  console.log('watch once')
  iframe.value!.onload = () => {
    // console.log('load')
    // fixme: 因为 iframe 的 load 事件等待页面完全加载完成之后才会产生，可能导致进入页面一段时候后页面搜索快捷键才会生效
    iframe.value?.contentWindow?.addEventListener('keydown', onTabKeyUp)
  }
  // const observer = new MutationObserver((mutations) => {
  //   mutations.forEach((m) => {
  //     if (m.type === 'attributes' && m.attributeName === 'src') {
  //       console.log('iframe src has changed')
  //     }
  //   })
  // })
  // observer.observe(iframe.value!)
})

const searchDataSet = async (pattern: string) => {
  const strs = pattern.split(' ')
  // 当数据为空的时候不认为字符串相同，避免初始状态下没有搜索数据
  const isDatabaseStrSame = strs[0] && searchParams.databaseStr === strs[0]
  // const isContentStrSame = searchParams.contentStr === strs[1]
  searchParams.databaseStr = strs[0]
  searchParams.contentStr = strs[1]

  if (searchParams.contentStr) {
    utools.findInPage(searchParams.contentStr)
    isFinding = true
  } else {
    utools.stopFindInPage('clearSelection')
    isFinding = false
  }

  if (strs.length === 2) {
    isContentSearch.value = true
  } else {
    isContentSearch.value = false
  }

  if (!curDbItem.value || searchParams.contentStr || isDatabaseStrSame) return
  // 在数据库中搜索数据
  const result = await window.searchDb(curDbItem.value.dbPath, searchParams.databaseStr)
  list.value = result
  if (result.length) {
    itemClick(0, result[0].path)
  }
}
const debounceSearch = debounce(searchDataSet, 200)

onMounted(() => {
  console.log('mounted')
  searchDataSet('')
  utools.setSubInput((e) => {
    const { text } = e as any
    debounceSearch(text)
  })
})

const onPluginEnter = useEventBus(onPluginEnterKey)
onPluginEnter.on(() => {
  utools.setSubInput((e) => {
    const { text } = e as any
    debounceSearch(text)
  })
})

</script>

<style scoped lang="scss">
.search {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  > aside {
    flex: 0 0 30%;
    border-right: 1px solid #eeeeee;
    overflow: auto;

    &.hide {
      display: none;
    }

    .list-group {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .list-group-item {
      border-radius: 0;
      border: 0;
      user-select: none;
      padding: 5px 10px;

      &.active {
        color: #212529;
        background-color: #e9ecef;
        border-color: #e9ecef;
      }
    }
  }

  > main {
    flex: 1 1;

    iframe {
      width: 100%;
      height: 100%;
      display: block;
      border: 0;
    }
  }
}
</style>