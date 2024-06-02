<script lang="ts" setup>
import NoneLayout from '@/layout/NoneLayout.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
</script>

<template>
  <component :is="$route.meta.layout == 'none' ? NoneLayout : DefaultLayout" />
</template>

<style scoped></style>
