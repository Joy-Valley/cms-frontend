<script setup>
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'

const items = ref()

import { FilterMatchMode } from 'primevue/api'

const filters = ref()
const selectedCustomers = ref()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    article_title: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    article_description: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    create_date: {
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    update_date: {
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    'author.nickName': {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    tags: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    categories: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

onMounted(() => {
  loading.value = true

  lazyParams.value = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  }

  loadLazyData()
})
const first = ref(0)
const loading = ref(false)
const totalRecords = ref(0)
const lazyParams = ref()

const loadLazyData = async () => {
  loading.value = true
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value }
  await articleApi
    .list(lazyParams.value.page + 1 || 1, 5, 'desc', JSON.stringify(lazyParams.value))
    .then((response) => {
      items.value = response.data
      totalRecords.value = response.data.total
      loading.value = false
    })
    .catch((error) => console.error(error))
}
const onPage = (event) => {
  lazyParams.value = event
  loadLazyData(event)
}
const onSort = (event) => {
  lazyParams.value = event
  loadLazyData(event)
}
const onFilter = (event) => {
  lazyParams.value.filters = filters.value
  loadLazyData(event)
}
</script>

<template>
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
    v-model:selection="selectedCustomers"
    v-if="items"
    :value="items.list"
    paginator
    :rows="5"
    filterDisplay="menu"
    dataKey="article_id"
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
              placeholder="关键字搜索"
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
    </Column>

    <Column field="article_title" header="标题" sortable :showFilterMatchModes="false">
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="article_description" header="简介" sortable :showFilterMatchModes="false">
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
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
    <Column field="author.nickName" header="作者" sortable :showFilterMatchModes="false">
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="tags" header="标签" sortable :showFilterMatchModes="false">
      <template #body="{ data }">
        <Tag v-for="tag in data.tags" :key="tag.tag_id" :value="tag.tag_name" />
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="categories" header="分类" sortable :showFilterMatchModes="false">
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
          placeholder="Search by name"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
