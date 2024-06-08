<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})
</script>

<template>
  <Card>
    <template #content>
      <div>
        <div class="flex justify-between">
          <p class="text-xl font-semibold mb-2">{{ props.title }}</p>
          <i :class="['text-4xl', props.icon]"></i>
        </div>
        <div class="text-3xl font-medium">
          {{ props.content }}
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
