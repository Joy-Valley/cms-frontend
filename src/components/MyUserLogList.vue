<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { userLogsAPI } from '@/api/userlogs'

const toast = useToast() // useToast() 是 PrimeVue 提供的API

//
// =====================================================
// ====开始表格基础相关
// =====================================================
const items = ref({ list: [] }) //表格数据

// 加载数据
const loadLazyData = async (event) => {
  loading.value = true
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value }
  await userLogsAPI
    .list(lazyParams.value.page + 1, lazyParams.value.rows, 'desc')
    .then((response) => {
      items.value = response.data
      totalRecords.value = response.data.total
      loading.value = false
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: '错误',
        detail: (error.response && error.response.data.message) || error.message,
        life: 3000
      })
      loading.value = false
    })
}

// onMounted时初始化分页参数, 加载数据
onMounted(() => {
  loading.value = true //显示加载状态

  lazyParams.value = {
    first: 0,
    rows: rows.value,
    page: 0
  } // 初始化分页参数

  loadLazyData() // 加载数据
})

// =====================================================
// ====结束表格基础相关
// =====================================================

//
// =====================================================
// ====开始分页相关
// =====================================================
const first = ref(0)
const rows = ref(15) //每页显示数量
const loading = ref(false) //加载状态
const totalRecords = ref(0) //总记录数
const lazyParams = ref() //分页参数
// 分页事件
const onPage = (event) => {
  lazyParams.value = event
  loadLazyData(event)
}
// =====================================================
// ====结束分页相关
// =====================================================
//

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <div>
    <DataTable
      lazy
      :first="first"
      :totalRecords="totalRecords"
      @page="onPage($event)"
      :loading="loading"
      :value="items.list"
      paginator
      :rows="rows"
      :rowsPerPageOptions="[5, 15, 25, 50]"
      dataKey="id"
      resizableColumns
      columnResizeMode="fit"
      show-gridlines
    >
      <Column field="id" header="ID"></Column>
      <Column field="userId" header="用户ID"></Column>
      <Column field="username" header="用户名"></Column>
      <Column field="method" header="请求方法"></Column>
      <Column field="path" header="请求路径"></Column>
      <Column field="ip" header="IP"></Column>
      <Column field="device" header="设备"></Column>
      <Column field="os" header="系统"></Column>
      <Column field="browser" header="浏览器"></Column>
      <Column field="status" header="状态"></Column>
      <Column field="uploadTime" header="上传时间" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.uploadTime) }}
        </template>
      </Column>
      <Column field="updateTime" header="更新时间" dataType="date">
        <template #body="{ data }">
          {{ formatDate(data.updateTime) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
