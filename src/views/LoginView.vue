<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type LoginRequest, UserService } from '@/services/UserService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const errorMessage = ref('')
const loading = ref(false)

/**
 * 定义表单验证规则
 */
const schema = yup.object({
  email: yup.string().email('邮箱格式有误').required('必填').label('邮箱'),
  password: yup.string().required('必填').label('密码')
})

/**
 * 定义表单字段、处理表单提交和错误信息
 */
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema
})

/**
 * 定义邮箱字段和相关属性
 */
const [email, emailAttrs] = defineField('email', {
  validateOnModelUpdate: false
})

/**
 * 定义密码字段和相关属性
 */
const [password, passwordAttrs] = defineField('password', {
  validateOnModelUpdate: false,
  validateOnChange: false
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  errorMessage.value = ''
  try {
    // 调用 UserService 的 login 方法进行登录
    const response = await UserService.login(values as LoginRequest)
    // 将返回的 accessToken、refreshToken 和 userInfo 存储到 userStore 中
    userStore.accessToken = response.data.accessToken
    userStore.refreshToken = response.data.refreshToken
    userStore.userInfo = response.data.userInfo
    // 跳转到仪表盘页面
    router.push('/dashboard')
  } catch (error: any) {
    // 如果登录失败，将错误信息存储到 errorMessage 中
    if (error.response) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = error.message
    }
  }
  loading.value = false
})
</script>

<template>
  <div class="h-[100vh] w-full flex items-center justify-center">
    <Card class="h-fit w-[400px]">
      <template #content>
        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
        <form @submit="onSubmit">
          <div class="mb-4">
            <label for="email" class="block text-900 font-medium mb-2">邮箱</label>
            <InputText
              v-model="email"
              v-bind="emailAttrs"
              class="w-full"
              :invalid="errors.email != null"
            />
            <small id="email-help" class="p-error">
              {{ errors.email }}
            </small>
          </div>
          <div class="mb-4">
            <label for="password1" class="block text-900 font-medium mb-2">密码</label>
            <Password
              v-model="password"
              v-bind="passwordAttrs"
              class="w-full"
              :invalid="errors.password != null"
              toggleMask
              :feedback="false"
            />
            <small id="password-help" class="p-error">
              {{ errors.password }}
            </small>
          </div>
          <div class="mb-4">
            <Checkbox
              v-model="userStore.isRemember"
              id="remember"
              :binary="true"
              class="mr-2"
            ></Checkbox>
            <label for="remember">记住登录</label>
          </div>
          <Button
            :loading="loading"
            label="登录"
            type="submit"
            icon="pi pi-user"
            class="w-full"
          ></Button>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
