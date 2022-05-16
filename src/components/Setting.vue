<template>
  <div style="padding-top: 10px;">
    <el-form ref="formIns" inline :model="formData" :rules="formRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="数据集描述"/>
      </el-form-item>
      <el-form-item label="关键词" prop="key">
        <el-input v-model="formData.key" placeholder="功能关键字"/>
      </el-form-item>
      <el-form-item label="数据目录" prop="path">
        <el-input v-model="formData.path" placeholder="数据集文件夹路径"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addItem">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column type="index" label="#"/>
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="key" prop="key"/>
      <el-table-column label="路径" prop="path"/>
      <el-table-column label="操作" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" plain @click="removeItem($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { 
  ElButton, ElTable, ElTableColumn, ElForm, 
  ElFormItem, ElInput, FormRules, FormInstance
} from 'element-plus'
import { TableItemData } from '../interfaces';
import { DBData } from '../DBData';

defineOptions({
  name: 'Setting'
})

const props = defineProps<{
  dbData: DBData
}>()

const tableData = props.dbData.data
const formData = ref<TableItemData>({
  name: '',
  key: '',
  path: '',
  dbPath: '',
  base: '',
})

const formRules = reactive<FormRules>({
  name: { type: 'string', required: true, trigger: 'blur', message: '请输入数据集描述' },
  key: { type: 'string', required: true, trigger: 'blur', message: '请输入功能关键字' },
  path: { type: 'string', required: true, trigger: 'blur', message: '请输入功能文件夹路径' },
})

const formIns = ref<FormInstance>()

const addItem = async () => {
  try {
    await formIns.value?.validate()
  } catch (e) {
    return
  }

  const meta = await window.resolveDataset(formData.value.path)
  const itemObj = { ...formData.value, ...meta }

  props.dbData.addItem(itemObj)
}

const removeItem = (index: number) => {
  props.dbData.deleteItem(index)
}
</script>