<script setup lang="ts">
// import NavBar from '@/components/NavBar.vue'
// import TableToolbar from '@/components/License/TableToolbar.vue'

import { onMounted } from 'vue'

onMounted(() => {
  console.log('mainlayout mounted')
})

</script>

<template>
  <header class="header__container">
    <!-- <NavBar /> -->
    main layout header
  </header>

  <main class="container">
    <component :is="$route.meta.layout || 'div'">
      <slot />
    </component>
  </main>

  <footer>
    main layout footer
  </footer>
</template>

<style>
</style>
