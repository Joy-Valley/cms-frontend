<script lang="ts" setup>
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'
import { ref } from 'vue'
import { useForm } from 'vee-validate'

import { CategoryAPI } from '@/api/category'
import * as yup from 'yup'
import { TagAPI } from '@/api/tag'
import { useToast } from 'primevue/usetoast'
import { articleApi } from '@/api/article'
import type { CreateRequest } from '@/api/article/type'

const toast = useToast()
const isLoading = ref(false)

// 分类相关
const categoryOptions = ref([])
const categoryDisabled = ref(true)
CategoryAPI.list(1, 25, 'asc')
  .then((response) => {
    categoryOptions.value = response.data.list
    categoryDisabled.value = false
  })
  .catch(() => {
    toast.add({ severity: 'error', summary: '错误', detail: '获取分类列表失败' })
  })
// 标签相关
const tagOptions = ref([])
const tagDisabled = ref(true)
TagAPI.list(1, 25, 'asc')
  .then((response) => {
    tagOptions.value = response.data.list
    tagDisabled.value = false
  })
  .catch(() => {
    toast.add({ severity: 'error', summary: '错误', detail: '获取标签列表失败' })
  })
/**
 * 定义表单验证规则
 */
const schema = yup.object({
  title: yup.string().required('必填'),
  description: yup.string().required('必填'),
  categoryIds: yup.array().min(1, '至少选择一个分类'),
  tagIds: yup.array().min(1, '至少选择一个标签'),
  content: yup.string().required('必填')
})

/**
 * 定义表单字段、处理表单提交和错误信息
 */
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  validateOnMount: true,
  initialValues: {
    title: '',
    description: '',
    categoryIds: [],
    tagIds: [],
    content: ''
  }
})
const [title] = defineField('title')
const [description] = defineField('description')
const [categoryIds] = defineField('categoryIds')
const [tagIds] = defineField('tagIds')
const [content] = defineField('content')

/**
 * 处理表单提交
 */
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  let body: CreateRequest = { ...values, publicDate: new Date() }
  await articleApi
    .create(body)
    .then(() => {
      toast.add({ severity: 'success', summary: '成功', detail: '发布文章成功' })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: '错误', detail: '发布文章失败' })
    })
  isLoading.value = false
})
</script>

<template>
  <div class="w-full">
    <form @submit="onSubmit">
      <div class="flex items-center gap-4">
        <div class="flex-1 my-4">
          <FloatLabel>
            <InputText class="w-full" v-model="title" size="large" :invalid="!!errors.title" />
            <label :class="errors.title ? 'text-red-500' : ''">标题</label>
          </FloatLabel>
        </div>
        <Button
          type="submit"
          :loading="isLoading"
          icon="pi ri-send-plane-fill"
          label="确认发布"
          class="h-12"
        />
      </div>
      <MarkdownEditor
        v-model="content"
        :class="errors.content ? 'box-content border border-red-500' : ''"
      />
      <div class="flex w-full my-8 gap-4">
        <FloatLabel class="basis-1/2 flex-shrink-0">
          <Textarea
            v-model="description"
            rows="5"
            cols="30"
            variant="filled"
            class="resize-none w-full"
            :invalid="!!errors.description"
          />
          <label :class="errors.description ? 'text-red-500' : ''">简介</label>
        </FloatLabel>
        <div class="basis-1/2 flex flex-col gap-10">
          <FloatLabel>
            <MultiSelect
              :disabled="categoryDisabled"
              display="chip"
              :showToggleAll="false"
              v-model="categoryIds"
              :options="categoryOptions"
              optionLabel="category_name"
              optionValue="category_id"
              :selectionLimit="3"
              filter
              class="w-full"
              :invalid="!!errors.categoryIds"
            />
            <label :class="errors.categoryIds ? 'text-red-500' : ''">分类</label>
          </FloatLabel>
          <FloatLabel>
            <MultiSelect
              :disabled="tagDisabled"
              display="chip"
              :showToggleAll="false"
              v-model="tagIds"
              :options="tagOptions"
              optionLabel="tag_name"
              optionValue="tag_id"
              :selectionLimit="3"
              filter
              class="w-full"
              :invalid="!!errors.tagIds"
            />
            <label :class="errors.tagIds ? 'text-red-500' : ''">标签</label>
          </FloatLabel>
        </div>
      </div>
    </form>
  </div>
</template>
