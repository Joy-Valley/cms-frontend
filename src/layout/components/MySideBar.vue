<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<boolean>({ default: true })
const isExpandedSidebarDrawer = defineModel<boolean>('isExpandedSidebarDrawer', { default: true })
const expandedKeys = ref({ articles: true })
const items = ref([
  [
    {
      key: 'dashboard',
      label: '仪表盘',
      icon: 'ri-dashboard-line',
      route: '/dashboard'
    }
  ],
  [
    {
      key: 'articles',
      label: '文章管理',
      icon: 'ri-article-line',
      items: [
        {
          key: 'articlesList',
          label: '文章列表',
          icon: 'ri-file-list-2-line',
          route: '/articles/list'
        },
        {
          key: 'articlesCreate',
          label: '发布文章',
          icon: 'ri-add-circle-line',
          route: '/articles/create'
        }
      ]
    },
    {
      key: 'category',
      label: '分类管理',
      icon: 'ri-folder-2-line',
      route: '/category'
    },
    {
      key: 'tag',
      label: '标签管理',
      icon: 'ri-price-tag-3-line',
      route: '/tag'
    },
    {
      key: 'user',
      label: '用户管理',
      icon: 'ri-user-line',
      route: '/user'
    },
    {
      key: 'userLog',
      label: '用户日志',
      icon: 'ri-list-view',
      route: '/user_log'
    }
  ]
])
const customDT = ref({
  panelBorderWidth: 0,
  panelFirstBorderWidth: 0,
  panelLastBorderWidth: 0
})
</script>

<template>
  <div
    :class="model ? 'lg:flex' : ''"
    class="hidden flex-col w-[--sidebar-width] h-full border-r-2"
  >
    <div class="h-[--topbar-height] flex items-center gap-2 p-3 border-b-2">
      <div class="w-8 h-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M20 22H4C3.44772 22 3 21.5523 3 21V8H21V21C21 21.5523 20.5523 22 20 22ZM21 6H3V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V6ZM7 11V15H11V11H7ZM7 17V19H17V17H7ZM13 12V14H17V12H13Z"
          ></path>
        </svg>
      </div>

      <div class="text-2xl font-medium line-clamp-1">JV-CMS</div>
    </div>
    <div class="flex-1 card flex flex-col overflow-auto">
      <PanelMenu
        v-for="(item, index) of items"
        :key="index"
        v-model:expandedKeys="expandedKeys"
        :model="item"
        class="w-full gap-0 border-b-2"
        :dt="customDT"
        multiple
      >
        <template #item="{ item }">
          <div :class="item.route == $route.fullPath ? 'bg-neutral-200 rounded' : ''">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route">
              <a
                v-ripple
                class="flex items-center cursor-pointer text-surface-700 px-3 py-2"
                :href="href"
                @click="navigate"
              >
                <span :class="item.icon" />
                <span class="ml-2 text-color">{{ item.label }}</span>
              </a>
            </router-link>
            <a
              v-else
              v-ripple
              class="flex items-center cursor-pointer text-surface-700 px-3 py-2"
              :href="item.url"
              :target="item.target"
            >
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
              <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
            </a>
          </div>
        </template>
      </PanelMenu>
    </div>
  </div>
  <div>
    <Drawer
      v-model:visible="isExpandedSidebarDrawer"
      header="Drawer"
      class="!w-[--sidebar-width]"
      :pt="{
        header: { class: 'p-0' },
        content: { class: 'p-0' }
      }"
    >
      <template #header>
        <div class="h-[--topbar-height] flex items-center gap-4 p-3">
          <svg
            width="35"
            height="40"
            viewBox="0 0 35 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-2rem"
          >
            <path
              d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
              fill="#000000"
            />
            <path
              d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
              fill="#000000"
            />
          </svg>
          <div class="text-2xl font-medium line-clamp-1">JV-CMS</div>
        </div>
      </template>
      <div class="flex-1 card flex flex-col overflow-auto">
        <PanelMenu
          v-for="(item, index) of items"
          :key="index"
          v-model:expandedKeys="expandedKeys"
          :model="item"
          class="w-full gap-0 border-b-2"
          :dt="customDT"
          multiple
        >
          <template #item="{ item }">
            <div :class="item.route == $route.fullPath ? 'bg-neutral-200 rounded' : ''">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route">
                <a
                  v-ripple
                  class="flex items-center cursor-pointer text-surface-700 px-3 py-2"
                  :href="href"
                  @click="navigate"
                >
                  <span :class="item.icon" />
                  <span class="ml-2 text-color">{{ item.label }}</span>
                </a>
              </router-link>
              <a
                v-else
                v-ripple
                class="flex items-center cursor-pointer text-surface-700 px-3 py-2"
                :href="item.url"
                :target="item.target"
              >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
              </a>
            </div>
          </template>
        </PanelMenu>
      </div>
    </Drawer>
  </div>
</template>

<style scoped></style>
