<script setup lang="ts">
import TableNavbar from '@/components/License/TableNavbar.vue'
import TableFooter from '@/components/License/TableFooter.vue'

// import { onBeforeMount } from 'vue'
// onBeforeMount(async () => {
// })

</script>

<template>
    <div class="wrapper">
        <TableNavbar />
        <RouterView />
        <TableFooter />
    </div>
    <!-- <EventScreenshotModal v-if="isEventScreenshotModalOpen" />
    <EventVideoModal v-if="isEventVideoModalOpen" /> -->
</template>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: fit-content;
    max-height: 83vh;
    position: relative;
}
</style>
