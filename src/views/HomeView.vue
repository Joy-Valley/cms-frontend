<script lang="ts" setup>
import MyDashboardCard from '@/components/MyDashboardCard.vue'
import MyRecentArticlesCard from '@/components/MyRecentArticlesCard.vue'
</script>

<template>
  <div class="w-full grid grid-cols-12 gap-4">
    <MyDashboardCard />
    <MyRecentArticlesCard/>
  </div>
</template>
