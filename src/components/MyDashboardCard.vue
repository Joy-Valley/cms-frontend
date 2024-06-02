<script lang="ts" setup>
import { ref } from 'vue'

const items = ref([
  { title: '文章', content: '4', icon: 'ri-article-fill' },
  { title: '用户', content: '54', icon: 'ri-user-3-fill' },
  { title: '评论', content: '32', icon: 'ri-message-fill' },
  { title: '浏览量', content: '34543', icon: 'ri-eye-fill' }
])
</script>

<template>
  <Card v-for="(item, index) of items" :key="index" class="col-span-12 md:col-span-6 xl:col-span-3">
    <template #content>
      <div>
        <div class="flex justify-between">
          <p class="text-xl font-semibold mb-2">{{ item.title }}</p>
          <i :class="['text-4xl', item.icon]"></i>
        </div>
        <div class="text-3xl font-medium">
          {{ item.content }}
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
