<template>
  <div class="env-selector yd-form-item">
    <p class="yd-form-label">选择环境：</p>
    <div class="yd-form-content">
      <el-checkbox-group v-model="checkedIds" size="small" @change="handleCheckChange" >
        <el-checkbox
          v-for="env in envList"
          :key="env.shopId"
          :value="env.shopId"
          :title="env.shopId"
          border
        >
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
const checkedIds = ref<string[]>([])
const checkedItems = defineModel<envItemType[]>()

const handleCheckChange = (): void => {
  checkedItems.value = envList.value.filter(item => checkedIds.value.includes(item.shopId))
}

const getEnvNum = async (): Promise<void> => {
  const res = await getEnvList()
  // console.log(res)
  if (res && res.code === 0) {
    envList.value = res.data.list || []
    // checkedIds.value = envList.value.map(item => item.shopId)
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
