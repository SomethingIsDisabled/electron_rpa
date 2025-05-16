<template>
  <div class="yd-form">
    <portStatus></portStatus>
    <envSelector v-model="selEnvs"></envSelector>
    <div class="yd-form-item">
      <div class="test"><el-button type="primary" @click="func">启动RPA</el-button></div>
      <div><el-button type="primary" @click="func2">test2</el-button></div>
    </div>
    <div>
      <ul>
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { envItemType } from '@/typings/global'
import { ElMessage } from 'element-plus'
import useStore from '@/store'

import portStatus from './components/portStatus.vue'
import envSelector from './components/envSelector.vue'

const { configStore } = useStore()

/** electron defined api */
const ElecAPI = window.api

const selEnvs = ref<envItemType[]>([])

const func = async (): Promise<void> => {
  if (selEnvs.value.length === 0) {
    ElMessage.warning('请选择环境')
    return
  }
  try {
    if (window.api) {
      const param = {
        port: configStore.apiPort,
        envList: JSON.parse(JSON.stringify(selEnvs.value))
      }
      // console.log(param)
      const res = await ElecAPI.run(param)
      console.log('ElecAPI_:', res)
    }
  } catch (error) {
    console.log(error)
  }
}

const func2 = async (): Promise<void> => {
  console.log('func2')
}

const logs = ref<string[]>([])

onMounted(() => {
  window.electron.ipcRenderer.on('log', (event, log) => {
    logs.value.push(log)
    // 这里可以根据需要将日志显示在UI中
    console.log('Received log:', log)
  })
})
</script>

<style lang="less" scoped>
.yd-form {
  padding: 10px;
  justify-content: center;
  height: 100%;
}
</style>
