<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { UserAPI } from '@/api/user'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginRequest } from '@/api/user/type'

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
    const response = await UserAPI.login(values as LoginRequest)
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
  <div
    class="h-[100vh] w-full flex items-center justify-center bg-gradient-to-b from-green-100 to-green-200"
  >
    <Card class="h-fit w-[400px] shadow-2xl">
      <template #content>
        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-center gap-2 pb-4 border-b-2">
            <div class="w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20 22H4C3.44772 22 3 21.5523 3 21V8H21V21C21 21.5523 20.5523 22 20 22ZM21 6H3V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V6ZM7 11V15H11V11H7ZM7 17V19H17V17H7ZM13 12V14H17V12H13Z"
                ></path>
              </svg>
            </div>

            <div class="text-2xl font-medium line-clamp-1">JV-CMS 登录</div>
          </div>
          <div>
            <Message v-if="errorMessage" severity="error" class="my-4">{{ errorMessage }}</Message>
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
              <div class="mb-4 w-full">
                <label for="password1" class="block text-900 font-medium mb-2">密码</label>
                <Password
                  v-model="password"
                  v-bind="passwordAttrs"
                  class="w-full"
                  :feedback="false"
                  inputClass="w-full"
                  :invalid="errors.password != null"
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
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
