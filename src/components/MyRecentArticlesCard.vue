<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import type { Data } from '@/api/article/type'

onMounted(async () => {
  await articleApi
    .list(1, 25, 'desc')
    .then((response) => {
      items.value = response.data
    })
    .catch((error) => console.error(error))
})

const items = ref<Data>()
</script>

<template>
  <Card class="col-span-12 xl:col-span-6">
    <template #content>
      <DataTable v-if="items" :value="items.list" paginator :rows="7">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl text-surface-900 dark:text-surface-0 font-bold">最近文章</span>
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
        <Column field="article_description" header="简介">
          <template #body="{ data }">
            <span class="line-clamp-2">
              {{ data.article_description }}
            </span>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped></style>
