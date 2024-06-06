<script lang="ts" setup>
import MySideBar from '@/components/MySideBar.vue'
import MyTopBar from '@/components/MyTopBar.vue'
</script>

<template>
  <main class="flex">
    <MySideBar />
    <div class="lg:ml-[300px] w-full">
      <MyTopBar />
      <div class="p-4">
        <router-view />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
