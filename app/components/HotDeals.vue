<script setup lang="ts">
const route = useRoute()
const { category } = route.params

const { fetchCategory } = await useProducts()
const products = fetchCategory(category?.toString())

const productsWithBadges = products.filter((product) => product.badge)
</script>

<template>
  <div>
    <UContainer class="py-8">
      <div class="flex items-center justify-center text-4xl font-bold tracking-tight text-primary">
        <span>Hot Deals</span>
        <UIcon name="i-twemoji-fire" class="ml-2" width="28px" />
      </div>

      <section
        data-pg-name="Products"
        class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProductCard
          v-for="(product, index) in productsWithBadges"
          :key="index"
          v-bind="product"
        />
      </section>
    </UContainer>
  </div>
</template>

<style scoped>
</style>
