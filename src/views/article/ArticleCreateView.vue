<script lang="ts" setup>
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import Select from 'primevue/select'

import { CategoryAPI } from '@/api/category'
import * as yup from 'yup'
import { TagAPI } from '@/api/tag'
import { useToast } from 'primevue/usetoast'
import { articleApi } from '@/api/article'
import type { CreateRequest } from '@/api/article/type'
import { getArticleStatusNameByCode, getArticleStatusSeverityByCode } from '@/const'

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
  content: yup.string().required('必填'),
  status: yup.string().required('必填')
})

/**
 * 定义表单字段、处理表单提交和错误信息
 */
const { defineField, errors, values } = useForm({
  validationSchema: schema,
  validateOnMount: true,
  initialValues: {
    title: '',
    description: '',
    categoryIds: [],
    tagIds: [],
    content: '',
    status: ''
  }
})
const [title] = defineField('title')
const [description] = defineField('description')
const [categoryIds] = defineField('categoryIds')
const [tagIds] = defineField('tagIds')
const [content] = defineField('content')
const [status] = defineField('status')

/**
 * 处理表单提交
 */
const onSubmit = async () => {
  //如果errors.value不为空，说明表单验证不通过
  if (Object.keys(errors.value).length) {
    toast.add({ severity: 'error', summary: '错误', detail: '请填写必填字段' })
    return
  }

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
}

const statuses = [
  { name: '草稿', code: 'draft' },
  { name: '审核中', code: 'pending' }
]
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="onSubmit">
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
      <div class="flex w-full my-8 gap-x-4 gap-y-8 flex-wrap">
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
        <FloatLabel class="min-w-32">
          <Select
            class="w-full"
            :options="statuses"
            optionLabel="name"
            optionValue="code"
            :invalid="!!errors.status"
            v-model="status"
          >
            <template #value="{ value }">
              <Tag
                class="h-6"
                v-if="value"
                :value="getArticleStatusNameByCode(value)"
                :severity="getArticleStatusSeverityByCode(value)"
              />
            </template>
            <template #option="slotProps">
              <Tag
                class="h-6"
                :value="slotProps.option.name"
                :severity="getArticleStatusSeverityByCode(slotProps.option.code)"
              />
            </template>
          </Select>
          <label :class="errors.status ? 'text-red-500' : ''">状态</label>
        </FloatLabel>
      </div>
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
      </div>
    </form>
  </div>
</template>
