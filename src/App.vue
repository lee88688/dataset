<template>
  <el-config-provider :locale="local">
    <component :is="curComponent" :dbData="dbData" :envData="envData"/>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useEventBus } from '@vueuse/core';
import { ElConfigProvider } from 'element-plus'
import local from 'element-plus/lib/locale/lang/zh-cn'
import Setting from './components/Setting.vue'
import Search from './components/Search.vue'
import { DBData } from './DBData'
import { CurEnvData } from './interfaces'
import { onPluginEnterKey } from './utools-event-bus'

defineOptions({
  components: { Setting, Search }
})

const curComponent = ref('Search')

const envData = ref<CurEnvData>()

const dbData = reactive(new DBData)
dbData.readData()

const onPluginEnter = useEventBus(onPluginEnterKey)
onPluginEnter.on((e) => {
  envData.value = e;
  if (e.code === 'dataset') {
    curComponent.value = 'Setting'
  } else {
    curComponent.value = 'Search'
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

html, body {
  padding: 0;
  margin: 0;
}
</style>
