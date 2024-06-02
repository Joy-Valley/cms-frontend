<script setup lang="ts">
import { ref } from 'vue'

const home = ref({
  icon: 'pi pi-home'
})
const items = ref([{ label: 'Electronics' }, { label: 'Computer' }, { label: 'Accessories' }])
</script>

<template>
  <div class="menubar">
    <Menubar>
      <template #start>
        <div class="flex">
          <Button icon="ri-menu-line" aria-label="Submit" />
          <Breadcrumb :home="home" :model="items" />
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
