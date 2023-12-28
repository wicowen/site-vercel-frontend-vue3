<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import TableToolbar from '@/components/Record/TableToolbar.vue'
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main class="record">
        <div class="record__container">
            <TableToolbar />
            <RouterView />
        </div>
    </main>
</template>

<style lang="scss" scoped>
</style>
