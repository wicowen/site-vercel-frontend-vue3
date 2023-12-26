import { defineStore } from "pinia"
import { blocklistApi } from '@/apis'
import { useAuthStore } from '@/stores'
import { useRoute } from "vue-router";
import type { Column, BlockList, SortRule, ScreenshotInfo } from '@/composables/models'

export const useBlocklistStore = defineStore({
    id: 'blockList',
    state: () => ({
        isFileImported: <boolean>false,
        isImportDataModalOpen: <boolean>false,
        resetTiming: <number>0,
        deleteTiming: <number>0,
        allDataList: <BlockList[]>[],
        selectedList: <BlockList[]>[],
        blockList: <BlockList[]>[],
        isDataLoaded: <boolean>false,
        isPageNoLoaded: <boolean>false,
        totalPage: <number>1,
        totalItem: <number>0,
        currentPage: <number>1,
        pageSize: <number>20,
        filterValue: <string>'',
        sortDirection: <SortRule[]>[],
        conditionForApi: <any>{},
    }),
    getters: {
    },
    actions: {
        turnOnImportDataModal() {
            this.isImportDataModalOpen = true
        },
        turnOffImportDataModal() {
            this.isImportDataModalOpen = false
        },
        async resetAll() {
            this.resetTiming = Date.now();
            this.resetCurrentPage()
            this.selectedList = []
            await this.getBlocklistByPageApi(1)
            await this.getBlocklistTotalPageApi()
        },
        resetCurrentPage() {
            this.currentPage = 1
        },
        setRecordCondition(page: number) {
            this.conditionForApi = {
                "pageSize": this.pageSize,
                "pageNumber": page,
                "filterValue": this.filterValue,
                "sortRule": this.sortDirection
            }
        },
        async getBlocklistApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const condition = {
                    "filterValue": this.filterValue
                }
                const result = await blocklistApi.getBlocklist(JSON.stringify(condition));
                this.allDataList = result.data
            } catch (error: any) {
                console.log(error)
            }
        },
        async getBlocklistByPageApi(page: number = 1) {
            try {
                this.isDataLoaded = false
                await useAuthStore().refreshTokenApi()
                this.isFileImported = await this.getWaitingFilesApi()
                if (this.isFileImported) return
                this.setRecordCondition(page)
                let condition = this.conditionForApi
                let result = await blocklistApi.getBlocklistByPage(JSON.stringify(condition));
                if (result.data.length === 0) result = await blocklistApi.getBlocklistByPage(JSON.stringify(condition))
                if (result.data.length === 0) result = await blocklistApi.getBlocklistByPage(JSON.stringify(condition))
                this.blockList = result.data

                this.isDataLoaded = true
            } catch (error: any) {
                console.log(error)
            }
        },
        async getBlocklistTotalPageApi() {
            try {
                this.isPageNoLoaded = false
                await useAuthStore().refreshTokenApi()
                this.isFileImported = await this.getWaitingFilesApi()
                if (this.isFileImported) return
                const data = {
                    "pageSize": this.pageSize,
                    "filterValue": this.filterValue
                }
                let result = await blocklistApi.getBlocklistTotalPage(JSON.stringify(data));
                if (result.data.totalPage === 0) result = await blocklistApi.getBlocklistTotalPage(JSON.stringify(data))
                if (result.data.totalPage === 0) result = await blocklistApi.getBlocklistTotalPage(JSON.stringify(data))
                this.totalPage = result.data.totalPage
                this.totalItem = result.data.totalItem
                this.isPageNoLoaded = true
            } catch (error: any) {
                console.log(error)
            }
        },
        async importLicensePlateFileApi(file: File) {
            try {
                const formData = new FormData()
                formData.append('file', file)

                await useAuthStore().refreshTokenApi()
                const result = await blocklistApi.ImportLicensePlateFile(formData);
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async editLicensePlateApi(id: string, plate: string, type: string) {
            try {
                await useAuthStore().refreshTokenApi()
                if (type.toLocaleLowerCase() === 'allowlist') type = '9eed7ac8-bf1a-4bd5-b46c-414708bb4c2e'
                if (type.toLocaleLowerCase() === 'blocklist') type = '34d8270d-7181-467f-b76b-43a998b7dd8e'

                const data = {
                    "id": id,
                    "licensePlate": plate,
                    "licenseCategory": type
                }
                const result = await blocklistApi.editLicensePlate(data);
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async deleteLicensePlatesApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const data = this.selectedList.map(i => { return i.licensePlateId })
                const result = await blocklistApi.deleteLicensePlates(JSON.stringify(Array.from(data)));
                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async getWaitingFilesApi() {
            try {
                const result = await blocklistApi.getWaitingFiles();           
                return result.data.needWaiting
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return false
            }
        },
        async getSampleFileApi() {
            try {
                const result = await blocklistApi.getSampleFiles();
                return result.data
            } catch (error: any) {
                console.log(error)
                return `LicenseCategory,LicensePlate
                Allowlist,AB-1234
                Blocklist,CD-567`
            }
        }
    }
})