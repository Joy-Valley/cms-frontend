<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ProductService } from '@/service/ProductService'

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data))
})

const products = ref()
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success'

    case 'LOWSTOCK':
      return 'warning'

    case 'OUTOFSTOCK':
      return 'danger'

    default:
      return null
  }
}
</script>

<template>
  <Card class="col-span-12 xl:col-span-6">
    <template #content>
      <DataTable :value="products" paginator :rows="5">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl text-surface-900 dark:text-surface-0 font-bold">最近文章</span>
          </div>
        </template>
        <Column header="封面">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="w-[4rem] shadow-md rounded"
            />
          </template>
        </Column>
        <Column field="name" header="标题"></Column>
        <Column field="price" header="Price">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="category" header="Category"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped></style>
