<script lang="ts" setup>
import MySideBar from '@/components/MySideBar.vue'
import MyTopBar from '@/components/MyTopBar.vue'
import { ref } from 'vue'
const isExpandedSidebar = ref(true)
const isExpandedSidebarDrawer = ref(false)
</script>

<template>
  <main class="flex h-screen min-w-0">
    <MySideBar
      v-model="isExpandedSidebar"
      v-model:isExpandedSidebarDrawer="isExpandedSidebarDrawer"
    />
    <div class="flex flex-col min-w-0 flex-1 h-full bg-neutral-100">
      <MyTopBar
        v-model="isExpandedSidebar"
        v-model:isExpandedSidebarDrawer="isExpandedSidebarDrawer"
      />
      <router-view class="p-4 overflow-auto" />
    </div>
  </main>
</template>

<style scoped></style>
