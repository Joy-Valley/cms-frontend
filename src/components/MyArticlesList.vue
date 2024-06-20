<script setup>
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Select from 'primevue/select'

import { FilterMatchMode } from '@primevue/core/api'

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
  await articleApi
    .query(JSON.stringify(lazyParams.value))
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
    sortField: 'article_id',
    sortOrder: -1,
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
const rows = ref(10) //每页显示数量
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
    article_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    article_description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    create_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    update_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    'author.nickName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
    categories: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
const contextMenuSelection = ref(null) //右键菜单选中的数据
//右键菜单选项
const menuModel = ref([])
// 右键菜单事件
const onRowContextMenu = (event) => {
  // 如果selectedItems中没有event.data
  if (!selectedItems.value.find((item) => item.article_id === event.data.article_id)) {
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
      articleApi
        .removeList(items.map((item) => item.article_id))
        .then(() => {
          toast.add({ severity: 'success', summary: '成功', detail: '删除成功', life: 3000 })
          selectedItems.value = []
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

//获取Tag的颜色
const getSeverity = (status) => {
  switch (status) {
    case 'published':
      return 'success'
    case 'draft':
      return 'warn'
    case 'pending':
      return 'info'
    case 'locked':
      return 'secondary'
    default:
      return 'info'
  }
}

const statuses = ref(['published', 'draft', 'pending', 'locked'])
const statusUpdate = (value, articleId) => {
  articleApi
    .updateStatus(articleId, value)
    .then(() => {
      toast.add({ severity: 'success', summary: '成功', detail: '更新成功', life: 3000 })
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
      @sort="onSort($event)"
      @filter="onFilter($event)"
      :loading="loading"
      removableSort
      v-model:filters="filters"
      v-model:selection="selectedItems"
      :value="items.list"
      paginator
      :rows="rows"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      filterDisplay="menu"
      dataKey="article_id"
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
            <span class="relative">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                @change="onFilter()"
                @keydown.enter="onFilter()"
                v-model="filters.global.value"
                placeholder="搜索关键字"
                class="pl-10 font-normal"
              />
            </span>
            <Button
              label="发布文章"
              icon="pi pi-plus-circle"
              @click="$router.push('/articles/create')"
            />
          </div>
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="article_id" header="ID" sortable> </Column>
      <Column header="封面">
        <template #body="slotProps">
          <img
            :src="`${slotProps.data.cover_src}`"
            :alt="slotProps.data.cover_src"
            class="w-[4rem] shadow-md rounded"
          />
        </template>
        <template #filterclear="{ filterModel, filterCallback }">
          <Button label="清除" text @click="clearFieldFilter(filterModel, filterCallback)" />
        </template>
      </Column>

      <Column field="article_title" header="标题" sortable :showFilterMatchModes="false">
        <template #body="{ data }">
          <span class="line-clamp-1">{{ data.article_title }}</span>
        </template>
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
        field="article_description"
        header="简介"
        sortable
        :showFilterMatchModes="false"
        class="max-w-[400px]"
      >
        <template #body="{ data }">
          <span class="line-clamp-1">{{ data.article_description }}</span>
        </template>
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
        class="min-w-40"
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
        class="min-w-40"
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
        field="author.nickName"
        header="作者"
        sortable
        :showFilterMatchModes="false"
        class="min-w-32"
      >
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="搜索关键字"
          />
        </template>
      </Column>
      <Column field="tags" header="标签" sortable :showFilterMatchModes="false" class="min-w-32">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Tag
              v-for="tag in data.tags"
              severity="secondary"
              :key="tag.tag_id"
              :value="tag.tag_name"
            />
          </div>
        </template>
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
        field="categories"
        header="分类"
        sortable
        :showFilterMatchModes="false"
        class="min-w-32"
      >
        <template #body="{ data }">
          <div class="flex gap-2">
            <Tag
              severity="secondary"
              v-for="categories in data.categories"
              :key="categories.category_id"
              :value="categories.category_name"
            />
          </div>
        </template>
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
        field="categories"
        header="状态"
        sortable
        :showFilterMatchModes="false"
        class="min-w-32"
      >
        <template #body="{ data }">
          <div class="flex gap-2">
            <Select
              :options="statuses"
              placeholder="Select One"
              v-model="data.article_status"
              @update:modelValue="statusUpdate($event, data.article_id)"
            >
              <template #value="{ value }">
                <Tag :value="value" :severity="getSeverity(value)" />
              </template>
              <template #option="slotProps">
                <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
              </template>
            </Select>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="搜索关键字"
          />
        </template>
      </Column>
      <Column header="操作">
        <template #body="slotProps">
          <Button
            text
            class="h-5 w-5"
            color="primary"
            type="button"
            icon="ri-pencil-line"
            rounded
            @click="editItem(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
