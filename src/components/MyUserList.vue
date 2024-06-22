<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode } from '@primevue/core/api'
import { UserAPI } from '@/api/user'
import { genderOptions, getGenderNameByCode } from '@/const'

const toast = useToast() // useToast() 是 PrimeVue 提供的API
const confirm = useConfirm()

//
// =====================================================
// ====开始表格基础相关
// =====================================================
const items = ref({ list: [] }) //表格数据
const selectedItems = ref([]) //选中的数据

// 加载数据
const loadLazyData = async (event) => {
  loading.value = true
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value }
  let UserListRequest = {
    pageSize: lazyParams.value.rows,
    pageNo: lazyParams.value.page,
    username: lazyParams.value.filters.global.value
  }
  await UserAPI.list(UserListRequest)
    .then((response) => {
      items.value = response.data
      totalRecords.value = response.data.total
      loading.value = false
    })
    .catch((error) => console.error(error))
}

// onMounted时初始化分页参数, 加载数据
onMounted(() => {
  loading.value = true //显示加载状态

  lazyParams.value = {
    first: 0,
    rows: rows.value,
    filters: filters.value,
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

//
// =====================================================
// ====开始筛选功能
// =====================================================
const filters = ref() //筛选条件

// 初始化筛选条件
const initFilters = () => {
  filters.value = {
    // 全局搜索
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}
// 清除筛选条件
const clearFilter = () => {
  initFilters()
  onFilter()
}

// 筛选事件
const onFilter = (event) => {
  lazyParams.value.filters = filters.value
  loadLazyData(event)
}

// =====================================================
// ====结束筛选功能
// =====================================================
//

//
// =====================================================
// ====开始右键菜单功能
// =====================================================
const cm = ref()
const contextMenuSelection = ref(null) //右键菜单选中的数据
//右键菜单选项
const menuModel = ref([])
// 右键菜单事件
const onRowContextMenu = (event) => {
  // 如果selectedItems中没有event.data
  if (!selectedItems.value.find((item) => item.category_id === event.data.category_id)) {
    selectedItems.value = [event.data]
  }
  menuModel.value = [
    {
      label: `删除 ${selectedItems.value.length} 条数据`,
      icon: 'pi ri-delete-bin-2-fill',
      command: () => deleteItems(selectedItems.value),
      class: 'context-menu-red-500'
    }
  ]
  cm.value.show(event.originalEvent)
}

// =====================================================
// ====结束右键菜单
// =====================================================
//

//
// =====================================================
// ====开始添加项目功能
// =====================================================
const addItemDialog = ref(false) //添加对话框
const currentAddItem = ref({}) //当前添加的数据

//添加项目事件
const addItem = () => {
  UserAPI.create(currentAddItem.value)
    .then(() => {
      toast.add({ severity: 'success', summary: '成功', detail: '添加成功', life: 3000 })
      loadLazyData()
      addItemDialog.value = false
      currentAddItem.value = {}
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: '错误',
        detail: (error.response && error.response.data.message) || error.message,
        life: 3000
      })
    })
}
// =====================================================
// ====结束添加项目功能
// =====================================================
//

//
// =====================================================
// ====开始删除项目功能
// =====================================================

// 删除多条数据
const deleteItems = (items) => {
  confirm.require({
    message: `你确定要删除 ${items.length} 条数据吗？`,
    header: '确认删除？',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: '删除',
      severity: 'danger'
    },
    accept: () => {
      for (const item of items) {
        UserAPI.delete(item.id)
          .then(() => {
            toast.add({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 })
            loadLazyData()
          })
          .catch((error) => {
            toast.add({
              severity: 'error',
              summary: '错误',
              detail: (error.response && error.response.data.message) || error.message,
              life: 3000
            })
          })
      }
    }
  })
}

// =====================================================
// ====结束删除项目功能
// =====================================================
//

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 初始化筛选条件
initFilters()
</script>

<template>
  <div>
    <ContextMenu ref="cm" :model="menuModel" />
    <DataTable
      lazy
      :first="first"
      :totalRecords="totalRecords"
      @page="onPage($event)"
      :loading="loading"
      v-model:selection="selectedItems"
      :value="items.list"
      paginator
      :rows="rows"
      :rowsPerPageOptions="[5, 15, 25, 50]"
      filterDisplay="menu"
      dataKey="id"
      contextMenu
      v-model:contextMenuSelection="contextMenuSelection"
      @rowContextmenu="onRowContextMenu"
      resizableColumns
      columnResizeMode="fit"
      show-gridlines
      selectionMode="multiple"
      metaKeySelection
      highlightOnSelect
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="清除筛选"
            outlined
            @click="clearFilter()"
          />
          <div class="flex gap-1">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                @change="onFilter()"
                @keydown.enter="onFilter()"
                placeholder="搜索关键字"
                v-model="filters.global.value"
              />
            </IconField>
            <Button label="新建用户" icon="pi pi-plus-circle" @click="addItemDialog = true" />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="ID"> </Column>
      <Column field="username" header="用户名"> </Column>
      <Column field="nickName" header="昵称"> </Column>
      <Column field="email" header="邮箱"> </Column>
      <Column field="gender" header="性别">
        <template #body="{ data }"> {{ getGenderNameByCode(data.gender) }} </template>
      </Column>
      <Column field="phoneNumber" header="手机号"> </Column>
      <Column field="roles" header="权限">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Tag
              v-for="role in data.roles"
              severity="secondary"
              :key="role.id"
              :value="role.roleName"
            />
          </div>
        </template>
      </Column>
      <Column field="createTime" header="创建时间" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.createTime) }}
        </template>
      </Column>
      <Column field="updateTime" header="更新时间" dataType="date">
        <template #body="{ data }">
          {{ formatDate(data.updateTime) }}
        </template>
      </Column>
      <Column field="lastLoginIp" header="上次登录IP"> </Column>
      <Column field="lastLoginTime" header="上次登录时间" dataType="date">
        <template #body="{ data }">
          {{ formatDate(data.lastLoginTime) }}
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="addItemDialog" modal header="新建用户" :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label>邮箱</label>
          <InputText v-model="currentAddItem.email" required="true" autofocus />
        </div>
        <div class="flex flex-col gap-2">
          <label>用户名</label>
          <InputText v-model="currentAddItem.username" required="true" />
        </div>
        <div class="flex flex-col gap-2">
          <label>昵称</label>
          <InputText v-model="currentAddItem.nickName" required="true" />
        </div>
        <div class="flex flex-col gap-2">
          <label>性别</label>
          <Select
            v-model="currentAddItem.gender"
            :options="genderOptions"
            optionLabel="name"
            optionValue="code"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label>生日</label>
          <DatePicker v-model="currentAddItem.birthdayDate" />
        </div>
        <div class="flex flex-col gap-2">
          <label>手机号</label>
          <InputText v-model="currentAddItem.phoneNumber" required="true" />
        </div>
        <div class="flex flex-col gap-2">
          <label>密码</label>
          <InputText v-model="currentAddItem.password" required="true" />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="取消"
            icon="ri-close-line"
            severity="secondary"
            @click="addItemDialog = false"
          ></Button>
          <Button type="button" label="保存" icon="ri-check-line" @click="addItem()"></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
