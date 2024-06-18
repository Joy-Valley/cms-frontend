<script setup>
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import { FilterMatchMode } from '@primevue/core/api'

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
  console.log('deleteSelect')
}

// =====================================================
// ====结束右键菜单
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
      dataKey="article_id"
      @rowContextmenu="onRowContextMenu"
      resizableColumns
      columnResizeMode="fit"
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
      <Column field="article_description" header="简介" sortable :showFilterMatchModes="false">
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
          <Tag v-for="tag in data.tags" :key="tag.tag_id" :value="tag.tag_name" />
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
          <Tag
            v-for="categories in data.categories"
            :key="categories.category_id"
            :value="categories.category_name"
          />
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
            class="w-8 h-8"
            type="button"
            icon="ri-edit-fill"
            rounded
            @click="editItem(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
