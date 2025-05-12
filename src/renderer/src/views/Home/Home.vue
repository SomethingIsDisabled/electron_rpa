<template>
  <portStatus></portStatus>
  <envSelector></envSelector>
  <div class="test"><el-button type="primary" @click="func">test1</el-button></div>

  <div><el-button type="primary" @click="func">test2</el-button></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// import { ipcRenderer } from 'electron';

import portStatus from './components/portStatus.vue'
import envSelector from './components/envSelector.vue'


// console.log(ipcRenderer)

const func = async () => {
  try {
    // console.log(window.electron)

    const res = await window.electron.ipcRenderer.send('ping')
    console.log('-------', res)
  } catch (error) {
    console.log(error)
  }
}


</script>

<style lang="less" scoped>

.test {
  background-color: #fff;
  color: #333;
}
</style>
