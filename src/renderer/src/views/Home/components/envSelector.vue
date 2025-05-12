<template>
  <div class="env-selector">
    <p>选择环境：</p>
    <div>
      <el-checkbox-group v-model="checkGroup" size="small">
        <el-checkbox v-for="env in envList" :key="env.shopId" :value="env.shopId" :title="env.shopId" border>
          {{ env.serial }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useYDApi } from '@/api/useYDApi'
import { envItemType } from '@/typings/global'
const { getEnvList } = useYDApi()

const envList = ref<envItemType[]>([])

const checkGroup = ref<string[]>([])

const getEnvNum = async () => {
  const res = await getEnvList();
  // console.log(res)
  if (res && res.code === 0) {
    envList.value = res.data.list
    // checkGroup.value = envList.value.map(item => item.shopId)
  }
}

getEnvNum()

</script>

<style lang="less" scoped>
.env-selector {
  display: flex;
  gap: 10px;

  > p {
    white-space: nowrap;
  }

  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .el-checkbox {
      margin-right: 0;
    }
  }
}
</style>
