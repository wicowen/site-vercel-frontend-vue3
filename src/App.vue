<script setup lang="ts">

import LayoutLoader from '@/layouts/LayoutLoader.vue'

// import { onMounted } from 'vue'
// import { RouterView } from 'vue-router'
// import { storeToRefs } from 'pinia'
// import { useGeneralStore } from '@/stores'

// import UserModal from '@/components/NavbarModal/UserModal.vue'
// import ReportSettingModal from '@/components/NavbarModal/ReportSettingModal.vue'
// import AboutModal from '@/components/NavbarModal/AboutModal.vue'
// import BackSettingModal from '@/components/NavbarModal/BackupSettingModal.vue'
// import AuthorizationModalVue from '@/components/NavbarModal/AuthorizationModal.vue'

// let { 
//   isUserModalOpen, 
//   isReportSettingModalOpen, 
//   isAboutModalOpen, 
//   isBackSettingModalOpen, 
//   isAuthorizationModalOpen 
// } = storeToRefs(useGeneralStore())


</script>

<template>

  <LayoutLoader />

  <!-- <component :is="$route.meta.layout">
  </component> -->

  <!-- <RouterView /> -->

  <!-- <Transition>
    <AboutModal v-if="isAboutModalOpen" />
  </Transition> -->
  <!-- <Transition>
    <UserModal v-if="isUserModalOpen" />
  </Transition> -->
  <!-- <Transition>
    <ReportSettingModal v-if="isReportSettingModalOpen" />
  </Transition> -->
  <!-- <Transition>
    <BackSettingModal v-if="isBackSettingModalOpen" />
  </Transition>
  <Transition>
    <AuthorizationModalVue v-if="isAuthorizationModalOpen" />
  </Transition> -->
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Noto Sans');

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
