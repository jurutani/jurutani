<script setup lang="ts">
// Kalau mau aktifin emit, tinggal uncomment
// const emit = defineEmits(['exploreProducts'])

// const exploreProducts = () => {
//   emit('exploreProducts')
// }
</script>

<template>
  <section>
    <UCard>
      <div
        class="bg-clip-text bg-gradient-to-r from-green-500 launch-sale-grid font-extrabold text-transparent to-emerald-700"
      >
        <div class="flex lg:flex lg:items-center" style="grid-area: sale">
          <span
            class="-tracking-wide font-semibold text-3xl uppercase lg:text-center"
          >
            Selamat Datang di Juru Tani!
          </span>
        </div>
        <div
          class="justify-center lg:flex lg:items-center"
          style="grid-area: discount"
        >
          <span
            class="-tracking-wide font-bold text-5xl uppercase whitespace-nowrap lg:text-6xl"
          >
            Panen Promo 
          </span>
        </div>
        <div style="grid-area: categories" class="flex items-center">
          <ul
            class="-tracking-wide font-extrabold space-y-2 text-right uppercase w-full whitespace-nowrap sm:space-y-0 lg:flex lg:flex-wrap lg:justify-center lg:space-x-2"
          >
            <li>Pertanian</li>
            <li>Perkebunan</li>
            <li>Peternakan</li>
            <li>Alat Tani</li>
            <li>Pupuk</li>
            <li>Dan Lainnya</li>
          </ul>
        </div>
      </div>
    </UCard>
  </section>
</template>

<style scoped>
.launch-sale-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'discount categories'
    'sale categories';
  gap: 20px;
  grid-area: sale;
}

@media (min-width: 1024px) {
  .launch-sale-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'sale discount categories';
    gap: 20px;
  }
}
</style>
