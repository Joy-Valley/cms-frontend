<script lang="ts" setup>
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'
import { ref } from 'vue'
import { useForm } from 'vee-validate'

import { CategoryAPI } from '@/api/category'
import * as yup from 'yup'
import { TagAPI } from '@/api/tag'
import { useToast } from 'primevue/usetoast'
import { articleApi } from '@/api/article'
import type { ArticleUpdateRequest, GetArticleByIdResponseData } from '@/api/article/type'

//文章ID
const props = defineProps({ id: { type: Number, required: true } })
const editItemDialog = defineModel<boolean>('editItemDialog', { default: null })

//文章详情
const article = ref<GetArticleByIdResponseData>()

//获取文章详情
articleApi.getArticleById(props.id).then((response) => {
  article.value = response.data as GetArticleByIdResponseData
  title.value = article.value?.article_title
  description.value = article.value?.article_description
  categoryIds.value = article.value?.categories.map((category) => category.category_id) as never[]
  tagIds.value = article.value?.tags.map((tag) => tag.tag_id) as never[]
  content.value = article.value?.article_content
})

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
const { defineField, errors } = useForm({
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
const onSubmit = async () => {
  //如果errors.value不为空，说明表单验证不通过
  if (Object.keys(errors.value).length) {
    toast.add({ severity: 'error', summary: '错误', detail: '请填写必填字段' })
    return
  }

  isLoading.value = true

  function getUpdatedValue(newValue: any, oldValue: any) {
    return newValue !== oldValue ? newValue : undefined
  }

  function getUpdatedArrayValue(newValue: any, oldValue: any) {
    // 首先，检查新旧数组的长度
    if (newValue.length !== oldValue.length) {
      return newValue // 长度不同，直接返回新数组
    }

    // 将新旧数组排序，以便比较
    const sortedNewValue = [...newValue].sort()
    const sortedOldValue = [...oldValue].sort()

    // 检查排序后的新旧数组是否相同
    const isSame = sortedNewValue.every((value, index) => value === sortedOldValue[index])

    // 如果数组相同，则返回undefined；否则，返回新数组
    return isSame ? undefined : newValue
  }

  const body: ArticleUpdateRequest = {}

  body.title = getUpdatedValue(title.value, article.value?.article_title)
  body.description = getUpdatedValue(description.value, article.value?.article_description)
  body.categoryIds = getUpdatedArrayValue(
    categoryIds.value,
    article.value?.categories.map((category) => category.category_id)
  )
  body.tagIds = getUpdatedArrayValue(
    tagIds.value,
    article.value?.tags.map((tag) => tag.tag_id)
  )
  body.content = getUpdatedValue(content.value, article.value?.article_content)

  // 移除所有未更新的字段（即值为undefined的字段）
  Object.keys(body).forEach((key) => body[key] === undefined && delete body[key])

  if (article.value?.article_id)
    await articleApi
      .update(article.value.article_id, body)
      .then(() => {
        toast.add({ severity: 'success', summary: '成功', detail: '更新文章成功' })
        editItemDialog.value = false
      })
      .catch(() => {
        toast.add({ severity: 'error', summary: '错误', detail: '更新文章失败' })
      })
  isLoading.value = false
}
</script>

<template>
  <div class="w-full pt-1">
    <form @submit.prevent="onSubmit">
      <div class="flex items-center gap-4">
        <div class="flex-1 my-4">
          <FloatLabel>
            <InputText class="w-full" v-model="title" size="large" :invalid="!!errors.title" />
            <label :class="errors.title ? 'text-red-500' : ''">标题</label>
          </FloatLabel>
        </div>
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
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="取消"
          icon="ri-close-line"
          severity="secondary"
          @click="editItemDialog = false"
        ></Button>
        <Button type="submit" label="保存" icon="ri-check-line"></Button>
      </div>
    </form>
  </div>
</template>
