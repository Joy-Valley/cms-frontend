<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import type { Data } from '@/api/article/type'

onMounted(async () => {
  await articleApi
    .list(1, 50, 'desc')
    .then((response) => {
      items.value = response.data
    })
    .catch((error) => console.error(error))
})

const items = ref<Data>()
</script>

<template>
  <div class="w-full">
    <DataTable
      v-if="items"
      :value="items.list"
      paginator
      :rows="20"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl text-surface-900 dark:text-surface-0 font-bold">文章列表</span>
          <Button
            label="发布文章"
            icon="pi pi-plus-circle"
            @click="$router.push('/articles_create')"
          />
        </div>
      </template>
      <Column header="封面">
        <template #body="slotProps">
          <img
            :src="`${slotProps.data.cover_src}`"
            :alt="slotProps.data.cover_src"
            class="w-[4rem] shadow-md rounded"
          />
        </template>
      </Column>
      <Column field="article_title" header="标题"></Column>
      <Column field="article_description" header="简介"></Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
