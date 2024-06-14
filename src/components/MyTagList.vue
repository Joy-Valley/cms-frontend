<script setup>
import { ref, onMounted } from 'vue'
import { TagAPI } from '@/api/tag'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'

const toast = useToast() // useToast() 是 PrimeVue 提供的API

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
  await TagAPI.list(
    lazyParams.value.page + 1 || 1,
    rows.value,
    'asc',
    JSON.stringify(lazyParams.value)
  )
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
    sortField: null,
    sortOrder: null,
    filters: filters.value
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
const rows = ref(25) //每页显示数量
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
// ====开始筛选、排序功能
// =====================================================
const filters = ref() //筛选条件

// 初始化筛选条件
const initFilters = () => {
  filters.value = {
    // 全局搜索
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // 按字段搜索
    tag_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tag_description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tag_slug: { value: null, matchMode: FilterMatchMode.CONTAINS },
    create_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    update_date: { value: null, matchMode: FilterMatchMode.DATE_IS }
  }
}
// 清除筛选条件
const clearFilter = () => {
  initFilters()
  onFilter()
}

const clearFieldFilter = (filterModel, filterCallback) => {
  filterModel.constraints.forEach((item) => {
    item.value = null
  })
  filterCallback()
  onFilter()
}

// 筛选事件
const onFilter = (event) => {
  lazyParams.value.filters = filters.value
  loadLazyData(event)
}

// 排序
const onSort = (event) => {
  lazyParams.value = event
  loadLazyData(event)
}

// =====================================================
// ====结束筛选、排序功能
// =====================================================
//

//
// =====================================================
// ====开始右键菜单功能
// =====================================================
const cm = ref()
//右键菜单选项
const menuModel = ref([
  { label: '删除', icon: 'pi ri-delete-bin-2-fill', command: () => deleteSelect(selectedItems) }
])
// 右键菜单事件
const onRowContextMenu = (event) => {
  cm.value.show(event.originalEvent)
}

// 删除选中的数据
const deleteSelect = () => {
  TagAPI.remove(selectedItems.value.map((item) => item.tag_id))
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

// =====================================================
// ====结束右键菜单
// =====================================================
//

//
// =====================================================
// ====开始编辑项目功能
// =====================================================
const currentEditItem = ref() //当前编辑的数据
const editItemDialog = ref(false) //编辑对话框

// 编辑项目
const editItem = (item) => {
  currentEditItem.value = { ...item }
  editItemDialog.value = true
}

// 保存项目
const saveItem = () => {
  TagAPI.update(
    currentEditItem.value.tag_id,
    currentEditItem.value.tag_name,
    currentEditItem.value.tag_description,
    currentEditItem.value.tag_slug
  )
    .then(() => {
      toast.add({ severity: 'success', summary: '成功', detail: '更新成功', life: 3000 })
      loadLazyData()
      editItemDialog.value = false
      currentEditItem.value = {}
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
// ====结束编辑项目功能
// =====================================================
//

//
// =====================================================
// ====开始添加项目功能
// =====================================================
const addItemDialog = ref(false) //添加对话框
const currentAddItem = ref({ tag_name: '', tag_description: '' }) //当前添加的数据

//添加项目事件
const addItem = () => {
  TagAPI.create(currentAddItem.value.tag_name, currentAddItem.value.tag_description)
    .then(() => {
      toast.add({ severity: 'success', summary: '成功', detail: '添加成功', life: 3000 })
      loadLazyData()
      addItemDialog.value = false
      currentAddItem.value = { tag_name: '', tag_description: '' }
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
    <ContextMenu v-if="selectedItems.length" ref="cm" :model="menuModel" />
    <DataTable
      lazy
      :first="first"
      :totalRecords="totalRecords"
      @page="onPage($event)"
      @sort="onSort($event)"
      @filter="onFilter($event)"
      :loading="loading"
      removableSort
      v-model:filters="filters"
      v-model:selection="selectedItems"
      :value="items.list"
      paginator
      :rows="rows"
      filterDisplay="menu"
      dataKey="tag_id"
      @rowContextmenu="onRowContextMenu"
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
            <span class="relative">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                @change="onFilter()"
                @keydown.enter="onFilter()"
                placeholder="搜索关键字"
                class="pl-10 font-normal"
              />
            </span>
            <Button label="新建标签" icon="pi pi-plus-circle" @click="addItemDialog = true" />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="tag_id" header="ID" sortable> </Column>

      <Column field="tag_name" header="名称" sortable :showFilterMatchModes="false">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="搜索关键字"
          />
        </template>
        <template #filterclear="{ filterModel, filterCallback }">
          <Button label="清除" text @click="clearFieldFilter(filterModel, filterCallback)" />
        </template>
      </Column>
      <Column field="tag_description" header="简介" sortable :showFilterMatchModes="false">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="搜索关键字"
          />
        </template>
      </Column>
      <Column field="tag_slug" header="别名" sortable :showFilterMatchModes="false">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="搜索关键字"
          />
        </template>
      </Column>
      <Column
        field="create_date"
        header="创建时间"
        sortable
        dataType="date"
        style="min-width: 10rem"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          {{ formatDate(data.create_date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
          />
        </template>
      </Column>
      <Column
        field="update_date"
        header="更新时间"
        sortable
        dataType="date"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          {{ formatDate(data.create_date) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
          />
        </template>
      </Column>
      <Column header="操作">
        <template #body="slotProps">
          <Button
            class="w-8 h-8"
            type="button"
            icon="ri-edit-fill"
            rounded
            @click="editItem(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="editItemDialog" modal header="编辑标签" :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="tag_name">名称</label>
          <InputText id="tag_name" v-model="currentEditItem.tag_name" required="true" autofocus />
        </div>
        <div class="flex flex-col gap-2">
          <label for="tag_description">简介</label>
          <Textarea
            id="tag_description"
            v-model="currentEditItem.tag_description"
            required="true"
            rows="3"
            cols="20"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="tag_slug">别名</label>
          <InputText id="tag_slug" v-model="currentEditItem.tag_slug" required="true" />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="取消"
            icon="ri-close-line"
            severity="secondary"
            @click="editItemDialog = false"
          ></Button>
          <Button type="button" label="保存" icon="ri-check-line" @click="saveItem()"></Button>
        </div>
      </div>
    </Dialog>
    <Dialog v-model:visible="addItemDialog" modal header="新建标签" :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="tag_name">名称</label>
          <InputText id="tag_name" v-model="currentAddItem.tag_name" required="true" autofocus />
        </div>
        <div class="flex flex-col gap-2">
          <label for="tag_description">简介</label>
          <Textarea
            id="tag_description"
            v-model="currentAddItem.tag_description"
            required="true"
            rows="3"
            cols="20"
          />
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
