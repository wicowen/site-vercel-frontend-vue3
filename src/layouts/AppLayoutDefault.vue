<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

// import { onMounted } from 'vue'
// onMounted(() => {
//   console.log('mainlayout mounted')
// })
</script>

<template>
  <header class="header__container">
    <NavBar />
    <!-- default layout header -->
  </header>

  <main class="main__container">
    <slot />
    <!-- <component :is="$route.meta.layout || 'div'"> -->
      <!-- <slot /> -->
    <!-- </component> -->
  </main>

  <footer class="footer__container">
    default layout footer
  </footer>
</template>

<style>
</style>

