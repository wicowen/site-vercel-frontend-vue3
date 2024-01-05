<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
// import TableToolbar from '@/components/License/TableToolbar.vue'

// import { onMounted } from 'vue'
// onMounted(() => {
//   console.log('mainlayout mounted')
// })
</script>

<template>
  <header class="header__container">
    <NavBar />
  </header>

  <main class="main__container">
    <slot />
    <!-- <component :is="$route.meta.layout || 'div'"> -->
      <!-- <slot /> -->
    <!-- </component> -->
  </main>

  <footer class="footer__container">
    <!-- main layout footer -->
  </footer>
</template>

<style>
</style>

