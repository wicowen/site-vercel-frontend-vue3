<script setup lang="ts">
// import { storeToRefs } from 'pinia'
import TableNavbar from '@/components/Record/TableNavbar.vue'
import TableFooter from '@/components/Record/TableFooter.vue'
// import EventScreenshotModal from '@/components/Record/EventScreenshotModal.vue'
// import EventVideoModal from '@/components/Record/EventVideoModal.vue'
// import { useRecordStore } from '@/stores'
import { onBeforeMount } from 'vue'
// let { isEventScreenshotModalOpen, isEventVideoModalOpen } = storeToRefs(useRecordStore())
// let { getRecordTotalPageApi, getRecordByPageApi, getDropdownListApi } = useRecordStore()


onBeforeMount(async () => {
    // await getRecordTotalPageApi()
    // await getRecordByPageApi()
    // await getDropdownListApi()
})

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
