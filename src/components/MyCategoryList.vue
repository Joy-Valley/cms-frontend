<script setup>
import { ref, onMounted } from 'vue'
import { CategoryAPI } from '@/api/category'

const items = ref({ list: [] })

import { FilterMatchMode } from 'primevue/api'

const filters = ref()
const selectedCustomers = ref()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category_name: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    category_description: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    category_slug: {
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    },
    create_date: {
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    update_date: {
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
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
    rows: rows.value,
    sortField: null,
    sortOrder: null,
    filters: filters.value
  }

  loadLazyData()
})
const first = ref(0)
const rows = ref(25)
const loading = ref(false)
const totalRecords = ref(0)
const lazyParams = ref()

const loadLazyData = async () => {
  loading.value = true
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value }
  await CategoryAPI.list(
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
    :value="items.list"
    paginator
    :rows="rows"
    filterDisplay="menu"
    dataKey="category_id"
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
            label="新建分类"
            icon="pi pi-plus-circle"
            @click="$router.push('/category/create')"
          />
        </div>
      </div>
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="category_id" header="ID" sortable> </Column>

    <Column field="category_name" header="名称" sortable :showFilterMatchModes="false">
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="category_description" header="简介" sortable :showFilterMatchModes="false">
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column field="category_slug" header="别名" sortable :showFilterMatchModes="false">
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
  </DataTable>
</template>

<style scoped></style>
