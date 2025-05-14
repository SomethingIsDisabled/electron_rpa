<template>
  <div class="port-state yd-form-item">
    <p class="yd-form-label">端口测试：</p>
    <div class="yd-form-content">
      <el-input v-model="curPort" class="port-ipt" :maxlength="5"></el-input>
      <p v-if="curPort !== config.port" class="reset" title="恢复默认" @click="curPort = config.port">
        <el-icon>
          <Close />
        </el-icon>
      </p>
      <div class="port-state-res">
        <p v-if="portStatus === 'ok'" class="ok">
          <el-icon>
            <CircleCheckFilled />
          </el-icon>
          <span>成功</span>
        </p>
        <p v-else class="fail">
          <el-icon>
            <CircleCloseFilled />
          </el-icon>
          <span>失败</span>
        </p>
      </div>
      <el-button type="primary" @click="testPort">连接测试</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import config from '../../../../../../resources/config.json'
import { useYDApi } from '@/api/useYDApi'
import { Close, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import useStore from '@/store'

const { configStore } = useStore()
const { getStatus } = useYDApi()

const curPort = ref(config.port || '')
const portStatus = ref('')

/**
 * 监听端口变化，更新配置文件和electron主进程的端口号
 */
watch(
  () => configStore.apiPort,
  () => {
    window.electron.ipcRenderer.send('set-port', configStore.apiPort)
  },
  { immediate: true }
)
/**
 * 设置自定义端口号，并测试端口是否可用
 */
const testPort = async (): Promise<void> => {
  if (curPort.value.length < 4) {
    ElMessage.error('端口号不能小于4位')
    return
  }
  if (!Number(curPort.value) || Number(curPort.value) > 65535) {
    ElMessage.error('请输入正确的端口号')
    return
  }
  if (curPort.value !== configStore.apiPort) {
    configStore.setPort(curPort.value)
  }
  // console.log(curPort.value, configStore.$state)
  const res = await getStatus()
  // console.log(res)
  if (res.code === 0) {
    portStatus.value = 'ok'
  } else {
    portStatus.value = 'fail'
  }
}

testPort()
</script>

<style lang="less" scoped>
.port-state {
  display: flex;
  gap: 10px;

  .port-ipt {
    width: 80px;
  }

  .reset {
    width: 25px;
    cursor: pointer;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .port-state-res {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;

    >p {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ok {
      color: green;
    }

    .fail {
      color: red;
    }

    .el-icon {
      margin-right: 5px;
    }
  }
}
</style>
