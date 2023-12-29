<script setup lang="ts">

import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// import { useGeneralStore, useChannelStore, useAuthStore, useRecordStore, useNotifyStore } from '@/stores'
import { useGeneralStore, useAuthStore, useNotifyStore } from '@/stores'
// import NotifyModal from '@/components/NavbarModal/NotifyModal.vue'
// import type { ConfigItem } from '@/composables/models'
// import { useConfig } from '@/composables/injectConfig'
// import { getCookie } from "@/composables/cookie";
import i18n from '@/plugins/i18n'
// import { useI18n } from 'vue-i18n';


// import { Client } from '@stomp/stompjs';
// let stompClientInform = new Client()
// let stompClientSentinel = new Client()

// const route = useRoute()
// const router = useRouter()
// let config: ConfigItem


// const { setNotifyStatus, getSignalRApi, getNotifyListApi } = useNotifyStore()
// let { currUser, language } = storeToRefs(useGeneralStore())
// let { isNewNotify, isNotifyOpen } = storeToRefs(useNotifyStore())
// const { openUserModal, openUserEditModal, openReportSettingModal, openAboutModal, openBackSettingModal, openAuthorizationModal, getCurrUserApi, getLookupCodeApi } = useGeneralStore()
// let { selectedChannelId } = storeToRefs(useChannelStore())
// const { currentType } = storeToRefs(useRecordStore())
// const { logout, setAuthStatus, getLicenseStatusApi } = useAuthStore()
// const { authStatus } = storeToRefs(useAuthStore())

let { currUser } = storeToRefs(useGeneralStore())
let { isNotifyOpen } = storeToRefs(useNotifyStore())
// const { openUserModal, openUserEditModal, openReportSettingModal, openAboutModal, openBackSettingModal, openAuthorizationModal, getCurrUserApi } = useGeneralStore()
const { openUserModal, openUserEditModal, openReportSettingModal, openAboutModal, openBackSettingModal, openAuthorizationModal } = useGeneralStore()
const { logout } = useAuthStore()

const navNotify = ref<HTMLElement | null>(null)
const navSetting = ref<HTMLImageElement | null>(null);
const navSpanSetting = ref<HTMLImageElement | null>(null);
const isSettingOpen = ref<boolean>(false)
const isDisableTooltip = ref<boolean>(false)
// let address: string = getCookie("connect");
const ifShowLanguageBox = ref<boolean>(false)
const languageBoxRef = ref<HTMLUListElement | null>(null)
const ifShowUserBox = ref<boolean>(false)
const UserBoxRef = ref<HTMLUListElement | null>(null)

const currUserGroup = computed(() => {

  if (currUser.value.groupId === 0) return 'Admin'

  if (currUser.value.groupId === 1) return 'User'

  return false
})

const handleOpenUserModal = () => {
  openUserModal()
  if (currUser.value.groupId === 1) openUserEditModal()
  ifShowUserBox.value = false
}

// const getCurrentRouteName = (): void => {
//   currentType.value = 'tableTFA'
// }

const closedDropdown = (e: MouseEvent) => {
  // 增加如點擊在img標籤外邊也要可以關閉  
  if (isSettingOpen.value && e.target !== navSetting.value && e.target !== navSpanSetting.value) {
    isSettingOpen.value = false
  }

  // if (isNotifyOpen.value && !navNotify.value?.contains(e.target as Node)) {
  //   isNotifyOpen.value = false
  // }
}

const toggleTooltip = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const targetToAvoid = document.querySelector('.notifyModal')
  const _targetToAvoid = document.querySelector('.dropdownList')
  const shouldSkipEvent = targetToAvoid && targetToAvoid.contains(target) || _targetToAvoid && _targetToAvoid.contains(target)
  if (shouldSkipEvent) {
    isDisableTooltip.value = true
  } else {
    isDisableTooltip.value = false
  }
}

// const loadNotiStomp = () => {
//   try {
//     stompClientInform.brokerURL = `ws://${address}:${config.Notify_signalR_port}/ws`
//     stompClientInform.reconnectDelay = 1000
//     if (!stompClientInform.active) {
//       stompClientInform.onConnect = () => {
//         stompClientInform.subscribe('/exchange/status/inform', (message) => {
//           setNotifyStatus(JSON.parse(message.body.toLocaleLowerCase()))
//           // console.log("小鈴鐺", message.body)
//         })
//       }
//       stompClientInform.activate()
//     }
//   } catch (error: any) {
//     console.log(error)
//   }
// }

// const exitNotiStomp = () => {
//   try {
//     if (stompClientInform.active) {
//       stompClientInform.deactivate()
//     }
//   } catch (error: any) {
//     console.log(error)
//   }
// }

// const loadSentiStomp = () => {
//   try {
//     stompClientSentinel.brokerURL = `ws://${address}:${config.Sentinel_signalR_port}/ws`
//     stompClientSentinel.reconnectDelay = 1000
//     if (!stompClientSentinel.active) {
//       stompClientSentinel.onConnect = () => {
//         stompClientSentinel.subscribe('/exchange/status/sentinel', (message) => {
//           setAuthStatus(JSON.parse(message.body.toLocaleLowerCase()))
//           // console.log("授權", message.body)
//         })
//       }
//       stompClientSentinel.activate()
//     }
//   } catch (error: any) {
//     console.log(error)
//   }
// }

// const exitSentiStomp = () => {
//   try {
//     if (stompClientSentinel.active) {
//       stompClientSentinel.deactivate()
//     }
//   } catch (error: any) {
//     console.log(error)
//   }
// }

onBeforeMount(async () => {
  // const needAuthPages = ['/GisView', '/RoiList'];
  // const sentinelRequired = needAuthPages.includes(route.path);
  // console.log(route.path);

  // if (route.path === '/') await getLicenseStatusApi()
  // useConfig().then((res) => {
  //   config = res
  //   if (!stompClientSentinel.active) loadSentiStomp()
  //   if (!stompClientInform.active) loadNotiStomp()
  // })
})

onMounted(async () => {
  // await getCurrUserApi()
  document.addEventListener('click', closedDropdown)
  document.addEventListener("click", closeLanguageBoxOnClickOutside);
  document.addEventListener("click", closeUserBoxOnClickOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', closedDropdown)
  // exitSentiStomp()
  // exitNotiStomp()
  document.removeEventListener("click", closeLanguageBoxOnClickOutside);
  document.removeEventListener("click", closeUserBoxOnClickOutside);
})
//測試用
const toggleLanguageBox = () => {
  ifShowLanguageBox.value = !ifShowLanguageBox.value
  if (ifShowLanguageBox.value) {
    // 添加點擊事件監聽器
    document.addEventListener("click", closeLanguageBoxOnClickOutside);
  } else {
    // 移除點擊事件監聽器
    document.removeEventListener("click", closeLanguageBoxOnClickOutside);
  }
}

const closeLanguageBoxOnClickOutside = (event: MouseEvent) => {
  const languageBox = languageBoxRef.value;
  const target = event.target as HTMLElement;

  // 檢查點擊的元素是否位於語言圖示和語言選單之外
  if (
    languageBox &&
    !languageBox.contains(target) &&
    !target.classList.contains("language")
  ) {
    ifShowLanguageBox.value = false;
    document.removeEventListener("click", closeLanguageBoxOnClickOutside);
  }
}

const seleLanguage = (index: number) => {
  let idx = ref()
  idx.value = ['zh', 'en'][index] || navigator.language.slice(0, 2) as any;

  // if (language.value === idx.value) {
  //   ifShowLanguageBox.value = false
  //   return
  // }

  localStorage.setItem("language", idx.value);
  // language.value = idx.value

  i18n.global.locale = idx.value;

  // const { locale } = useI18n({ useScope: 'global' })
  // locale.value = idx.value;

  location.reload()
  //locale.value = idx // 要切换的语言
  ifShowLanguageBox.value = false
}

const toggleUserBox = () => {
  ifShowUserBox.value = !ifShowUserBox.value
  if (ifShowUserBox.value) {
    // 添加點擊事件監聽器
    document.addEventListener("click", closeUserBoxOnClickOutside);
  } else {
    // 移除點擊事件監聽器
    document.removeEventListener("click", closeUserBoxOnClickOutside);
  }
}

const closeUserBoxOnClickOutside = (event: MouseEvent) => {
  const userBox = UserBoxRef.value;
  const target = event.target as HTMLElement;

  // 檢查點擊的元素是否位於選單之外
  if (
    userBox &&
    !userBox.contains(target) &&
    !target.classList.contains("user")
  ) {
    ifShowUserBox.value = false;
    document.removeEventListener("click", closeUserBoxOnClickOutside);
  }
}

// const backHome = () => {
//   // useChannelStore().setSelectedChannelId('')
//   router.push('/')
// }
</script>

<template>
  <div class="container">
    <div class="brand">
      <!-- <img @click="backHome" alt="img failed" class="brand__logo" src="\Logo.svg"> -->
      <img alt="img" class="brand__logo" src="https://placehold.co/204x86?text=Logo">
    </div>
    <div class="nav">

      <div class="nav__left">
        <!-- <router-link key='live' :to="{ name: 'live', query: { id: selectedChannelId } }" class="nav__left__item"
          :class="{ 'selected': route.name === 'live' }">{{ $t("channel.nav_name") }}</router-link>
        <router-link v-if="authStatus" key='gis' :to="{ name: 'gis', query: { id: selectedChannelId } }"
          class="nav__left__item" :class="{ 'selected': route.name === 'gis' }">{{ $t("gis") }}</router-link>
        <div v-else class="nav__left__item notAllowed">{{ $t("gis") }}</div>
        <div v-if="route.path.includes('Record')" class="nav__left__item"
          :class="{ 'selected': route.path.includes('Table') }">{{ $t("record.nav_name") }}
        </div>
        <router-link v-else @click="getCurrentRouteName" key='record' :to="{ name: 'tableTFA' }" class="nav__left__item"
          :class="{ 'selected': route.path.includes('Table') }">{{ $t("record.nav_name") }}</router-link>
        <router-link key='monitor' :to="{ name: 'monitor' }" class="nav__left__item"
          :class="{ 'selected': route.name === 'monitor' }">{{ $t("monitor.nav_name") }}</router-link>
        <router-link key='blockList' :to="{ name: 'blockList' }" class="nav__left__item"
          :class="{ 'selected': route.name === 'blockList' }">{{ $t("blockList.nav_name") }}</router-link> -->
      </div>

      <div class="nav__right">

        <!-- lang menu-->
        <VTooltip>
          <span @click="toggleLanguageBox" class="language nav__right__icon language"
            :class="{ nav__right__icon__active: ifShowLanguageBox }"><img alt="img failed"
              class="language nav__right__icon_img" src="\language.svg"></span>
          <template #popper>
            {{ $t('Language') }}
          </template>
        </VTooltip>
        <ul v-show="ifShowLanguageBox" class="language-box" ref="languageBoxRef">
          <li @click="seleLanguage(0)" class="language-box-item">繁體中文</li>
          <li @click="seleLanguage(1)" class="language-box-item">English</li>
        </ul>


        <!-- Notify -->
        <VTooltip :disabled="isDisableTooltip">
          <span ref="navNotify" @click.self="isNotifyOpen = !isNotifyOpen" @mouseover="toggleTooltip"
            class="nav__right__icon" :class="{ nav__right__icon__active: isNotifyOpen }">
            <img alt="img failed" @click.self="isNotifyOpen = !isNotifyOpen" src="\notifications.svg">
            <!-- <div @click.self="isNotifyOpen = !isNotifyOpen" class="nav__right__icon__redPoint" v-show="isNewNotify"></div> -->
            <!-- <NotifyModal class="notifyModal" v-if="isNotifyOpen" /> -->
          </span>
          <template #popper>
            {{ $t('Notification') }}
          </template>
        </VTooltip>

        <!-- Setting -->
        <VTooltip :disabled="isDisableTooltip">
          <span @mouseover="toggleTooltip" class="nav__right__icon nav__right__more"
            :class="{ nav__right__icon__active: isSettingOpen }">
            <label ref="navSpanSetting" for="nav_setting">
              <img alt="img failed" ref="navSetting" src="\settings.svg">
            </label>
            <input v-model="isSettingOpen" id="nav_setting" type="checkbox" class="toggle">
            <ul class="nav__right__more__menu dropdownList">
              <li v-if="currUserGroup === 'Admin'" @click="openAuthorizationModal" class="btn"><img alt="img failed"
                  src="\subscription_membership.svg">{{ $t("Authorization") }}
              </li>
              <li v-if="currUserGroup === 'Admin'" @click="openReportSettingModal" class="btn"><img alt="img failed"
                  src="\arrow_external_platform.svg">{{ $t("External_platform_setting") }}
              </li>
              <!-- <li @click="openResetPortModal" class="btn"><img alt="img failed" src="\edit.svg">Reset port
              </li> -->
              <li @click="openAboutModal" class="btn"><img alt="img failed" src="\document.svg">{{ $t("About") }}
              </li>
              <li v-if="currUserGroup === 'Admin'" @click="openBackSettingModal" class="btn"><img alt="img failed"
                  src="\backup_download.svg">{{ $t("Backup_restore_settings") }}
              </li>
            </ul>
          </span>
          <template #popper>
            {{ $t('Setting') }}
          </template>
        </VTooltip>


        <!-- User -->
        <VTooltip>
          <span @click="toggleUserBox" class="user nav__right__icon"
            :class="{ nav__right__icon__active: ifShowUserBox }"><img alt="img failed" class="user nav__right__icon_img"
              src="\person_outline.svg"></span>
          <template #popper>
            {{ currUser.userName }}({{ currUserGroup }})
          </template>
        </VTooltip>
        <ul ref="UserBoxRef" v-show="ifShowUserBox" class="user-box">
          <li @click="handleOpenUserModal" class="user-box-item"><img alt="img failed" src="\group.svg">{{
            $t("Manage_users") }}
          </li>
          <li @click="logout" class="user-box-item"><img alt="img failed" src="\logout.svg">{{ $t("Log_out") }}</li>
        </ul>
      </div>


    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100%;
}

.brand {
  display: flex;
  width: 26vw;
  place-items: center;
  padding-left: 1.75rem;
  &__logo {
    cursor: pointer;
    width: 4.5rem;
    height: 1.8969rem;
  }
}

.nav {
  display: flex;
  justify-content: space-between;
  width: 74vw;

  &__left {
    display: flex;
    margin-left: 2.5rem;
    place-items: center;

    &__item {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 1.6rem;
      font-size: .875rem;
      font-weight: 500;
      color: #FFFFFF;
    }

    &__item:hover {
      color: #656C74;
      border-bottom: .0625rem solid #656C74;
      cursor: pointer;
    }

    & .selected {
      border-bottom: .125rem solid #7BD7A1;
      color: #7BD7A1;
    }

    & .notAllowed {
      &:hover {
        color: #FFFFFF;
        border-bottom: none;
        cursor: not-allowed;
      }
    }
  }

  &__right {
    position: relative;
    display: flex;
    padding-right: 1.25rem;
    place-items: center;

    .language-box {
      z-index: 99;
      position: absolute;
      top: calc(5vh + 4px);
      left: -100px;
      display: flex;
      width: 10rem;
      padding: 0.5rem 0rem;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      border-radius: 4px;
      background: #515764;

      /* 下拉式選項_視窗陰影 */
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.50);

      &-item {
        display: flex;
        height: 2.5rem;
        padding: 0rem 1.25rem 0rem 0.75rem;
        align-items: center;
        gap: 0.5rem;
        align-self: stretch;
        border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.25);
        background: #515764;
        cursor: pointer;
        font-size: 0.875rem;
      }

      &-item:hover {
        border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.25);
        background: #656C74;
      }

      &-item:active {
        border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.25);
        background: #3A9376;
      }

      & li:first-child {
        border-top: .0625rem solid #00000040;
      }
    }

    &__username {
      margin-left: .5rem;
      max-width: 6.625rem;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__icon {
      position: relative;
      width: 2.375rem;
      height: 2.375rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      // 如果把cursor: pointer設定在img的話那外面的span標籤會漏掉,所以將cursor: pointer寫在span標籤上會比較好
      cursor: pointer;

      &__redPoint {
        position: absolute;
        top: 0.39rem;
        right: 0.39rem;
        width: 0.7rem;
        height: 0.7rem;
        background: #B7182B;
        border: 2px solid #3B414A;
        border-radius: 50%;
      }

      & img {
        width: 1.375rem;
        height: 1.375rem;
      }

      & label {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover,
      &:active {
        background: rgba(0, 0, 0, 0.20);
        border-radius: 50%;
      }

      &__active {
        background: rgba(0, 0, 0, 0.20);
        border-radius: 50%;
      }
    }

    &__more {
      cursor: pointer;

      &__menu {
        position: fixed;
        top: calc(5vh + 4px);
        width: 14.1375rem;
        right: .25rem;
        z-index: 99;
        display: flex;
        flex-direction: column;
        padding: .5rem 0;
        border-radius: .25rem;
        transform-origin: top;
        transform: scale(1, 0);
        opacity: 0;
        transition: transform 0.3s ease-out;
        background: #515764;
        box-shadow: 0rem .25rem .625rem rgba(0, 0, 0, 0.5);

        & li {
          display: flex;
          align-items: center;
          border-bottom: .0625rem solid rgba(0, 0, 0, 0.25);
          background: #515764;
          width: 100%;
          height: 2.5rem;
          white-space: nowrap;
          padding: .625rem 1.25rem .625rem .75rem;
          font-size: 0.875rem;
          color: #FFFFFF;
          cursor: pointer;
        }

        & li:hover {
          background: #656C74;
        }

        & li:active {
          background: #3A9376;
        }

        & li:first-child {
          border-top: .0625rem solid #00000040;
        }

        & img {
          margin-right: .5rem;
        }
      }

      & label {
        opacity: 0.9;
        cursor: pointer;
      }

      & input[type=checkbox] {
        display: none;
      }

      & input[type=checkbox]:checked~ul {
        opacity: 1;
        transform: scale(1, 1);
        transition: transform 0.8s ease-in-out;
        transition: opacity 0.1s ease-in-out;
      }
    }
  }

  .user-box {
    z-index: 99;
    position: absolute;
    width: 10rem;
    padding: 0.5rem 0rem;
    border-radius: 4px;
    background: #515764;
    /* 下拉式選項_視窗陰影 */
    box-shadow: 0rem 0.25rem 0.625rem 0rem rgba(0, 0, 0, 0.50);
    top: calc(5vh + 4px);
    right: 1.25rem;

    &-item {
      display: flex;
      border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.25);
      height: 2.5rem;
      padding: 0rem 0.75rem;
      align-items: center;
      gap: 0.5rem;
      align-self: stretch;
      background: #515764;
      font-size: 0.875rem;
      cursor: pointer;
    }

    &-item:hover {
      background: #656C74;
    }

    &-item:active {
      background: #3A9376;
    }

    & li:first-child {
      border-top: .0625rem solid #00000040;
    }
  }
}
</style>