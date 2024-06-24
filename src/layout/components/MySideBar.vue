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
        class="w-full !gap-0 border-b-2"
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
        header: { class: '!p-0' },
        content: { class: '!p-0' }
      }"
    >
      <template #header>
        <div class="h-[--topbar-height] flex items-center gap-4 p-3">
          <div class="w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 22H4C3.44772 22 3 21.5523 3 21V8H21V21C21 21.5523 20.5523 22 20 22ZM21 6H3V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V6ZM7 11V15H11V11H7ZM7 17V19H17V17H7ZM13 12V14H17V12H13Z"
              ></path>
            </svg>
          </div>
          <div class="text-2xl font-medium line-clamp-1">JV-CMS</div>
        </div>
      </template>
      <div class="flex-1 card flex flex-col overflow-auto">
        <PanelMenu
          v-for="(item, index) of items"
          :key="index"
          v-model:expandedKeys="expandedKeys"
          :model="item"
          class="w-full !gap-0 border-b-2"
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
