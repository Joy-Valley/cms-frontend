<script lang="ts" setup>
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import NoneLayout from '@/layout/NoneLayout.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { UserAPI } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 判断用户是否登录，如果登录则获取用户信息
if (userStore.isLogin) {
  UserAPI.info()
    .then((res) => {
      userStore.userInfo = res.data
    })
    .catch((err) => {
      console.error('无法获取用户信息:', err)
    })
}
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <component :is="$route.meta.layout == 'none' ? NoneLayout : DefaultLayout" />
</template>

<style scoped></style>
