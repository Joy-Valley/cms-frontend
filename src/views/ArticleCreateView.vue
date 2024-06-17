<script lang="ts" setup>
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'
import { ref } from 'vue'
const title = ref('')
const description = ref('')
const categoryIds = ref()
const categoryOptions = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
])
const tagIds = ref()
const tagOptions = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
])
</script>

<template>
  <div class="w-full">
    <form>
      <div class="flex items-center gap-4">
        <FloatLabel class="flex-1 my-4">
          <InputText class="w-full" id="title" v-model="title" size="large" />
          <label for="title">标题</label>
        </FloatLabel>
        <Button type="submit" icon="pi ri-send-plane-fill" label="确认发布" class="h-12" />
      </div>
      <MarkdownEditor />
      <div class="flex w-full my-8 gap-4">
        <FloatLabel class="basis-1/2">
          <Textarea
            v-model="description"
            rows="5"
            cols="30"
            variant="filled"
            class="resize-none w-full"
          />
          <label>简介</label>
        </FloatLabel>
        <div class="basis-1/2 flex flex-col gap-10">
          <FloatLabel>
            <MultiSelect
              id="ms-categories"
              :showToggleAll="false"
              v-model="categoryIds"
              :options="categoryOptions"
              optionLabel="name"
              filter
              class="w-full"
            />
            <label for="categories">分类</label>
          </FloatLabel>
          <FloatLabel>
            <MultiSelect
              id="ms-tags"
              :showToggleAll="false"
              v-model="tagIds"
              :options="tagOptions"
              optionLabel="name"
              filter
              class="w-full"
            />
            <label for="ms-tags">标签</label>
          </FloatLabel>
        </div>
      </div>
    </form>
  </div>
</template>
