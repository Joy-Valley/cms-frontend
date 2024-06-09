<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

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
</script>

<template>
  <div class="menubar">
    <Menubar>
      <template #start>
        <div class="flex">
          <Button icon="ri-menu-line" aria-label="Submit" />
          <Breadcrumb :home="home" :model="items">
            <template #item="{ item, props }">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span :class="[item.icon, 'text-color']" />
                  <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0/80">{{ item.label }}</span>
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
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped></style>
