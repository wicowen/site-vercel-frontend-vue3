<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import TableToolbar from '@/components/License/TableToolbar.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main class="container">
    <div class="license__container">
      <TableToolbar />
      <RouterView />
    </div>
  </main>
  <footer></footer>
</template>

<style lang="scss" scoped>
</style>
