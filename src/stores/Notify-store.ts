import { defineStore } from "pinia";
import { notifyApi, settingApi } from '@/apis'
import { useAuthStore } from '@/stores'
import moment from 'moment'
import type { ReportSetting, Notify } from '@/composables/models'

export const useNotifyStore = defineStore({
    id: 'notify',
    state: () => ({
        notifyList: <Notify[]>[],
        isNotifyOpen: <boolean>false,
        isNewNotify: <boolean>false,
    }),

    actions: {
        transformUtc(_date: string) {
            const utcDateString = _date;
            const utcMoment = moment.utc(utcDateString, "YYYY/MM/DD HH:mm:ss");
            const localMoment = utcMoment.local();
            const localFormatted = localMoment.format("YYYY/MM/DD HH:mm:ss");
            return localFormatted
        },
        setNotifyStatus(_bool: boolean) {
            this.isNewNotify = _bool
        },
        async getNotifyListApi() {
            try {
                const result = await notifyApi.getNotifyList();
                result.data.forEach((i: any) => i.updateDateTime = this.transformUtc(i.updateDateTime))

                // 處理資料邏輯
                this.notifyList = result.data
            } catch (error: any) {
                console.log(error)
            }
        },
        async getSignalRApi() {
            try {
                const result = await notifyApi.getSignalR();
            } catch (error: any) {
                console.log(error)
            }
        },
        async getBlackListFileApi(informId: string) {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await notifyApi.getBlackListFile(informId);
                const filenameHeader = result.headers["content-disposition"]

                // 從 Content-Disposition 標頭中取得 filename*=UTF-8''%E8%BB%8A%E7%89%8C%E8%99%9F%E7%A2%BC.csv 部分
                const filenameEncoded = filenameHeader.split(';')[2].trim();
                // 取得編碼後的檔案名稱部分，排除前面的 'filename*=UTF-8'''
                const encodedName = filenameEncoded.split('=')[1];
                const temp = encodedName.split("''")[1];

                // 解碼 UTF-8 編碼的檔案名稱
                const filename = decodeURIComponent(temp);

                // 處理資料邏輯
                return [result.data, filename]
            } catch (error: any) {
                console.log(error)
            }
        },
        async readNotifyApi(informId: string) {
            try {
                const result = await notifyApi.readNotify(informId);
                const contentDisposition = result.headers;
            } catch (error: any) {
                console.log(error)
            }
        },
        async readAllNotifyApi() {
            try {
                const result = await notifyApi.readAllNotify();
            } catch (error: any) {
                console.log(error)
            }
        }
    }
})