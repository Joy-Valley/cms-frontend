<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const userStore = useUserStore()
const model = defineModel<boolean>({ default: true })
const isExpandedSidebarDrawer = defineModel<boolean>('isExpandedSidebarDrawer', { default: false })

interface MenuItem {
  label: string | undefined
  route?: string
}

const home = ref({
  icon: 'pi pi-home',
  route: '/'
})

const items = ref<MenuItem[]>([
  {
    label: route.name?.toString(),
    route: route.path
  }
])

watch(route, (newRoute) => {
  // items.value = [{ label: newRoute.name?.toString(), route: newRoute.path }]
  items.value = newRoute.matched.map((record) => ({
    label: record.name?.toString(),
    route: record.path
  }))
})

const menu = ref()
const userItems = ref([
  {
    label: '退出登录',
    icon: 'ri-logout-box-r-line',
    command: () => {
      userStore.logout()
    }
  }
])

const toggle = (event: any) => {
  menu.value.toggle(event)
}
const showSidebar = () => {
  if (window.innerWidth < 1024) {
    isExpandedSidebarDrawer.value = true
  } else {
    model.value = !model.value
  }
}
</script>

<template>
  <Menubar class="h-[--topbar-height] rounded-none border-0 border-b-2 z-50">
    <template #start>
      <div class="flex items-center">
        <Button
          class="w-10 h-10"
          icon="ri-menu-line"
          aria-label="SideBarMenu"
          @click="showSidebar"
        />
        <Breadcrumb :home="home" :model="items">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate">
                <span :class="[item.icon, 'text-color']" />
                <span
                  :class="$route.fullPath == item.route ? 'text-primary' : ''"
                  class="font-semibold"
                  >{{ item.label }}</span
                >
              </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
              <span class="text-surface-700">{{ item.label }}</span>
            </a>
          </template>
        </Breadcrumb>
      </div>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
          @click="toggle"
        />
        <Menu ref="menu" id="overlay_menu" :model="userItems" :popup="true" />
      </div>
    </template>
  </Menubar>
</template>

<style scoped></style>
