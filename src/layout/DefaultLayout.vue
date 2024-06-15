<script lang="ts" setup>
import MySideBar from '@/components/MySideBar.vue'
import MyTopBar from '@/components/MyTopBar.vue'
</script>

<template>
  <main>
    <MySideBar class="hidden lg:block fixed top-0 left-0 h-full w-[--sidebar-width] border-r" />
    <MyTopBar class="z-50 fixed left-0 lg:left-[--sidebar-width] top-0 right-0" />
    <div class="lg:ml-[--sidebar-width] mt-[--topbar-height] p-4">
      <router-view />
    </div>
  </main>
</template>

<style scoped></style>
