<template>
  <section class="search">
    <aside>
      <ul class="list-group">
        <a 
          v-for="(item, index) in list"
          :key="index"
          class="list-group-item list-group-item-action"
          :class="index === activeIndex ? 'active' : ''"
          @click="itemClick(index, item.path)"
        >
          <div class="h5">{{item.name}}</div>
          <small class="text-muted">{{item.type}}</small>
        </a>
      </ul>
    </aside>
    <main>
      <iframe :src="iframeSrc" />
    </main>
  </section>
</template>

<script setup lang="ts">
import { useEventBus } from '@vueuse/core';
import debounce from 'lodash/debounce'
import { onActivated, ref, watch } from 'vue';
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

const curDbItem = ref<TableItemData>()

const searchDataSet = async (pattern: string) => {
  if (!curDbItem.value) return
  const result = await window.searchDb(curDbItem.value.dbPath, pattern)
  list.value = result
}
const debounceSearch = debounce(searchDataSet, 200)

watch(() => props.envData, () => {
  if (props.envData) {
    const { code } = props.envData
    const item = props.dbData.findByKey(code)
    if (item) curDbItem.value = item;
    searchDataSet('')
  }
})

const iframeSrc = ref('')

const itemClick = (index: number, path: string) => {
  const { url } = window.getHTMLPath(curDbItem.value!.docBasePath, path)
  iframeSrc.value = url
  activeIndex.value = index
  console.log('path: ', path)
}


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