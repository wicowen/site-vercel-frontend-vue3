import { defineStore } from "pinia"
import { authApi, settingApi } from '@/apis'
import { useAuthStore } from '@/stores'
import type { Account, User } from '@/composables/models'
import { swalErrorModal, swalSuccessModal } from '@/composables/swalModal'
import i18n from "@/plugins/i18n";

const { t } = i18n.global;
export const useGeneralStore = defineStore({
    id: 'general',
    state: () => ({
        userList: <User[]>[],
        currUser: <User>{},
        notifyType: <string[]>[],
        isUserModalOpen: false,
        isUserEditModalOpen: false,
        isReportSettingModalOpen: false,
        isAboutModalOpen: false,
        isBackSettingModalOpen: false,
        isAuthorizationModalOpen: false,
        language: localStorage.getItem('language') || navigator.language.slice(0, 2),
    }),

    actions: {
        openUserEditModal() {
            this.isUserEditModalOpen = true
        },
        closeUserEditModal() {
            this.isUserEditModalOpen = false
        },
        openUserModal() {
            this.isUserModalOpen = true
        },
        closeUserModal() {
            this.isUserModalOpen = false
        },
        openReportSettingModal() {
            this.isReportSettingModalOpen = true
        },
        closeReportSettingModal() {
            this.isReportSettingModalOpen = false
        },
        openAboutModal() {
            this.isAboutModalOpen = true
        },
        closeAboutModal() {
            this.isAboutModalOpen = false
        },
        openBackSettingModal() {
            this.isBackSettingModalOpen = true
        },
        closeBackSettingModal() {
            this.isBackSettingModalOpen = false
        },
        openAuthorizationModal() {
            this.isAuthorizationModalOpen = true
        },
        closeAuthorizationModal() {
            this.isAuthorizationModalOpen = false
        },
        async getUserListApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await authApi.getUserList();
                // 處理資料邏輯
                this.userList = result.data
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
            }
        },
        async getCurrUserApi() {
            try {
                const result = await authApi.getCurrUser();
                // 處理資料邏輯
                this.currUser = result.data
            } catch (error: any) {
                console.log(error)
            }
        },
        async increaseUserApi(data: Account) {
            try {
                await useAuthStore().refreshTokenApi()
                delete data.userCheckPwd
                const result = await authApi.importUser(JSON.stringify(data));
                if (result.status === 200) swalSuccessModal.fire(t('swalSuccessModal.New_user_has_been_added'))
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                swalErrorModal.fire(error.response.data.errorMessage)
                return errorStatus
            }
        },
        async editUserPwdApi(data: Account) {
            try {
                await useAuthStore().refreshTokenApi()
                delete data.userName
                delete data.userCheckPwd
                const result = await authApi.editUserPwd(JSON.stringify(data));
                if (result.status === 200) swalSuccessModal.fire(t('swalSuccessModal.New_password_has_been_saved'))
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                swalErrorModal.fire(error.response.data.errorMessage)
                return errorStatus
            }
        },
        async deleteUserApi(userId: string, groupId: number) {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await authApi.deleteUser(userId, groupId);
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)

            }
        },
        async getLookupCodeApi() {
            try {
                const result = await settingApi.getLookupCode();
                // 處理資料邏輯
                this.notifyType = result.data.notifyType
            } catch (error: any) {
                console.log(error)
            }
        },
    }
})