<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import ToolBar from '@/components/Record/Toolbar.vue'
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main class="record">
        <div class="record__container">
            <ToolBar />
            <RouterView />
        </div>
    </main>
</template>

<style lang="scss" scoped>
</style>
