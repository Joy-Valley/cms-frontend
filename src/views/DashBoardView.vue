<script lang="ts" setup>
import MyDashboardCard from '@/components/MyDashboardCard.vue'
import MyRecentArticlesCard from '@/components/MyRecentArticlesCard.vue'
import { articleApi } from '@/api/article'
import { onMounted, ref } from 'vue'

const DashboardItems = ref<
  {
    title: string
    content: string
    icon: string
  }[]
>([])

onMounted(async () => {
  await fetchDashboardItems()
})

async function fetchDashboardItems() {
  try {
    // 调用 articleApi 的 total 方法获取文章、点赞、评论、浏览总数
    const response = await articleApi.total()
    DashboardItems.value = [
      {
        title: '文章',
        content: response.data.articleTotal.toString(),
        icon: 'ri-article-fill'
      },
      { title: '点赞', content: response.data.likeTotal.toString(), icon: 'ri-heart-3-fill' },
      {
        title: '评论',
        content: response.data.commentTotal.toString(),
        icon: 'ri-message-fill'
      },
      { title: '浏览', content: response.data.viewsTotal.toString(), icon: 'ri-eye-fill' }
    ]
  } catch (error: any) {
    error
  }
}
</script>

<template>
  <div class="w-full grid grid-cols-12 gap-4">
    <MyDashboardCard
      v-for="(item, index) of DashboardItems"
      :key="index"
      :title="item.title"
      :icon="item.icon"
      :content="item.content"
      class="col-span-12 md:col-span-6 xl:col-span-3"
    />
    <MyRecentArticlesCard />
  </div>
</template>
