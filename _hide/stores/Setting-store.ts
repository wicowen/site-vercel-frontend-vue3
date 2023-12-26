import { defineStore } from "pinia";
import { settingApi } from '@/apis'
import { useAuthStore } from '@/stores'
import type { ReportSetting } from '@/composables/models'

export const useSettingStore = defineStore({
    id: 'setting',
    state: () => ({
        ReportList: <ReportSetting[]>[],
        isTestingEzproConnect: <boolean>false
    }),

    actions: {
        async getReportSettingListApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await settingApi.getReportSettingList();
                // 處理資料邏輯
                this.ReportList = result.data
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
            }
        },
        async getReportSettingApi(id: string) {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await settingApi.getReportSetting(id);
                // 處理資料邏輯
                return result.data
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
            }
        },
        async createReportSettingApi(data: ReportSetting) {
            try {
                await useAuthStore().refreshTokenApi()
                delete data.notifyId
                delete data.type
                delete data.verb
                delete data.token
                delete data.notifyContent
                delete data.notifyRemark

                const result = await settingApi.createReportSetting(JSON.stringify(data));
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async testEzproReportApi(url: string, user: string, pwd: string) {
            try {
                this.isTestingEzproConnect = true
                const data = {
                    "url": url,
                    "userName": user,
                    "password": pwd
                }

                const result = await settingApi.testEzproReport(JSON.stringify(data));
                this.isTestingEzproConnect = false
                return true
            } catch (error: any) {
                this.isTestingEzproConnect = false
                console.log(error)
                return false
            }
        },
        async editReportSettingApi(data: ReportSetting) {
            try {
                await useAuthStore().refreshTokenApi()
                delete data.type
                delete data.verb
                delete data.token
                delete data.notifyContent
                const result = await settingApi.editReportSetting(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async updateReportOnOffApi(id: string, isRun: boolean) {
            try {
                await useAuthStore().refreshTokenApi()
                let data =
                {
                    "notifyId": id,
                    "isRun": isRun
                }

                const result = await settingApi.updateReportOnOff(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                // const errorStatus: number = error.response.status
                console.log(error)
                // return errorStatus
            }
        },
        async deleteReportApi(id: string) {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await settingApi.deleteReport(id);
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        }
    }
})