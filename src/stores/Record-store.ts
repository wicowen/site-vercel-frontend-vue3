import { defineStore } from "pinia";
import { recordApi } from "@/apis";
import { useAuthStore } from "@/stores";
import { useRoute } from "vue-router";

import moment from 'moment'

import type { 
  RecordTFA, RecordLPDR, RecordVd, RecordTfaSum, 
  Column, SelectList, TfaRecordApiBody, 
  LpdrRecordApiBody, VdRecordApiBody, 
  SortRule, ScreenshotInfo, FilterDropdown 
} from '@/composables/models'


import { swalErrorModal } from '@/composables/swalModal'

import i18n from "@/plugins/i18n";
const { t } = i18n.global;

const prevMonth = new Date();
prevMonth.setMonth(prevMonth.getMonth() - 1);
prevMonth.setMinutes(0);
prevMonth.setSeconds(0);

const current = new Date();
current.setHours(current.getHours() + 1)
current.setMinutes(0);
current.setSeconds(0);

export const useRecordStore = defineStore({
  id: 'record',
  state: () => ({
    currentType: useRoute().name,
    screenShot: <ScreenshotInfo>{},
    screenShotType: <string>'',
    screenShotPlate: <string>'',
    screenId: <string>'',
    isScreenshotExisted: <boolean>false,
    isImageImported: <boolean>false,
    videoPlate: <string>'',
    videoId: <string>'',
    isFullScreen: <boolean>false,
    isEventScreenshotModalOpen: <boolean>false,
    isEventVideoModalOpen: <boolean>false,
    resetTiming: <number>0,
    allDataList: <any>[],
    selectList: <SelectList[]>[],
    recordTfaList: <RecordTFA[]>[],
    recordLpdrList: <RecordLPDR[]>[],
    recordVdList: <RecordVd[]>[],
    recordTfaSumList: <RecordTfaSum>{},
    isDataLoaded: <boolean>false,
    isPageNoLoaded: <boolean>false,
    totalPage: <number>1,
    totalItem: <number>0,
    currentPage: <number>1,
    timeInterval: <number>1,
    pageSize: <number>20,
    filterType: <string>'ChannelName,EventName,RoadName,LicensePlateNumber',
    filterValue: <string>'',
    channelNameFilter: <string[]>[],
    eventNameFilter: <string[]>[],
    eventTypeFilter: <string[]>[],
    startPeriod: prevMonth,
    endPeriod: current,
    vehicleTypeShowed: <Column[]>([
      { label: "truck", visible: true },
      { label: "bus", visible: true },
      { label: "car", visible: true },
      { label: "motorbike", visible: true },
      { label: "bike", visible: true },
      { label: "person", visible: true }
    ]),
    licenseCategoryShowed: <Column[]>([
      { label: "Normal", visible: true },
      { label: "Allowlist", visible: true },
      { label: "Blocklist", visible: true }
    ]),
    eventTypeShowed: <Column[]>([
      { label: t('record.eventType.red_light_turn_right'), visible: true, name: 'RedLightRightTurnViolation' },
      { label: t('record.eventType.red_light_turn_left'), visible: true, name: 'RedLightLeftTurnViolation' },
      { label: t('record.eventType.run_the_red_light'), visible: true, name: 'RedLightViolation' },
      { label: t('record.eventType.violating_one_way_lane'), visible: true, name: 'WrongWayDrivingViolation' },
      { label: t('record.eventType.crossing_double_whiteyellow_lines'), visible: true, name: 'CrossingDoubleLineViolation' },
      { label: t('record.eventType.illegal_parking'), visible: true, name: 'ParkingViolation' },
      { label: t('record.eventType.occupying_motorbike_waiting_area'), visible: true, name: 'VehicleExceptMotorbikeTripwireViolation' },
      { label: t('record.eventType.fail_to_keep_clear_at_intersection'), visible: true, name: 'VehicleTripwireWithSignalViolation' },
      { label: t('record.eventType.no_motorbike_lane'), visible: true, name: 'MotorbikeTripwireViolation' },
      { label: t('record.eventType.not_yielding_to_persons'), visible: true, name: 'VehicleTripwireIfPedestrianExistsViolation' }
    ]),
    VD: {
      RedLightRightTurnViolation: 'red light turn right',
      RedLightLeftTurnViolation: 'red light turn left',
      RedLightViolation: 'run the red light',
      WrongWayDrivingViolation: 'violating one-way lane',
      CrossingDoubleLineViolation: 'crossing double white/yellow lines',
      ParkingViolation: 'illegal parking',
      VehicleExceptMotorbikeTripwireViolation: 'occupying scooter waiting area',
      VehicleTripwireWithSignalViolation: 'fail to keep clear at intersection',
      MotorbikeTripwireViolation: 'no-scooter lane',
      VehicleTripwireIfPedestrianExistsViolation: 'not yielding to pedestrians'
    },
    sortDirection: <SortRule[]>[],
    conditionForTfaApi: <TfaRecordApiBody>{},
    conditionForLpdrApi: <LpdrRecordApiBody>{},
    conditionForVdApi: <VdRecordApiBody>{},
    filterDropDownList: <FilterDropdown>{},
    channelNameSelection: <SelectList[]>[],
    EventNameSelection: <SelectList[]>[],
    TfaTableSelection: <SelectList[]>[],
    LpdrTableSelection: <SelectList[]>[],
    isHideStreamFilter: <boolean>false
  }),
  getters: {
    carType: (state) => {
      let list = <string[]>[]
      state.vehicleTypeShowed.forEach(i => { if (i.visible) list.push(i.label) })
      return list
    },
    licenseCategory: (state) => {
      let list = <string[]>[]
      state.licenseCategoryShowed.forEach(i => { if (i.visible) list.push(i.label) })
      return list
    },
    eventType: (state) => {
      let list = <string[]>[]
      state.eventTypeShowed.forEach(i => { if (i.visible) list.push(i.name!) })
      return list
    }
  },
  actions: {
    createDroplistObject(name: string) {
      return { label: name, visible: true }
    },
    toggleHideStreamButton() {
      this.isHideStreamFilter = !this.isHideStreamFilter
    },
    async toggleFullscreen() {
      this.isFullScreen = !this.isFullScreen
      // if (this.isFullScreen) await this.getImageAndBoundApi(this.screenId)
    },
    async turnOnEventVideoModal(id: string, plate: string) {
      this.isEventVideoModalOpen = true
      this.videoPlate = plate
      this.videoId = id
      // const src = "https://admin:108io111@192.168.1.28:7011/media/0c21e8f4-1395-3d93-101f-24078b8cabf2.webm?pos=2023-07-20T10:00:00&endPos=2023-07-20T10:00:10"
      // const newWindow = window.open(src, "_blank");

      // //檢查新窗口是否被成功創建
      // if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      //   // 彈出窗口可能被阻止，進行處理
      //   alert("無法打開影像連結，請檢查瀏覽器設置是否阻止彈出窗口。");
      // }
    },
    async turnOnEventScreenshotModal(id: string, type: string, plate: string) {
      this.isEventScreenshotModalOpen = true
      this.screenShotType = type
      this.screenShotPlate = plate
      this.screenId = id
      await this.getImageAndBoundApi(id)
    },
    turnOffEventVideoModal() {
      this.isEventVideoModalOpen = false
      this.isFullScreen = false
    },
    turnOffEventScreenshotModal() {
      this.isEventScreenshotModalOpen = false
      this.isFullScreen = false
      this.isScreenshotExisted = false
      this.isImageImported = false
    },
    changeRecordType(type: string) {
      this.currentType = type
      this.resetTiming = Date.now();
      this.resetCurrentPage()
      this.selectList = []
      this.sortDirection = []
      this.vehicleTypeShowed.forEach(i => i.visible = true)
      this.licenseCategoryShowed.forEach(i => i.visible = true)
      this.eventTypeShowed.forEach(i => i.visible = true)
      this.timeInterval = 1
      this.resetCalendar()
    },
    async resetAll() {
      this.resetTiming = Date.now();
      this.resetCurrentPage()
      this.selectList = []
      this.sortDirection = []
      this.vehicleTypeShowed.forEach(i => i.visible = true)
      this.licenseCategoryShowed.forEach(i => i.visible = true)
      this.eventTypeShowed.forEach(i => i.visible = true)
      this.timeInterval = 1
      this.resetCalendar()
      await this.getRecordByPageApi(1)
      await this.getRecordTotalPageApi()
    },
    resetCalendar() {
      this.startPeriod = new Date();
      this.startPeriod.setMonth(this.startPeriod.getMonth() - 1);
      this.startPeriod.setMinutes(0)
      this.startPeriod.setSeconds(0)
      this.endPeriod = new Date();
      this.endPeriod.setHours(this.endPeriod.getHours() + 1)
      this.endPeriod.setMinutes(0)
      this.endPeriod.setSeconds(0)
    },
    resetCurrentPage() {
      this.currentPage = 1
    },
    transformUtc(_date: string) {
      const utcDateString = _date;
      const utcMoment = moment.utc(utcDateString, "YYYY/MM/DD HH:mm:ss");
      const localMoment = utcMoment.local();
      const localFormatted = localMoment.format("YYYY/MM/DD HH:mm:ss");
      return localFormatted
    },
    setTfaRecordCondition(page: number) {
      this.conditionForTfaApi = {
        "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "period": this.timeInterval,
        "pageSize": this.pageSize,
        "pageNumber": page,
        "carType": this.carType.join(','),
        "filterType": this.filterType,
        "filterValue": this.filterValue,
        "sortRule": this.sortDirection,
        "channelNameFilter": this.channelNameFilter.join(','),
        "eventNameFilter": this.eventNameFilter.join(','),
        "hideStreamFilter": this.isHideStreamFilter
      }
    },
    setLpdrRecordCondition(page: number) {
      this.conditionForLpdrApi = {
        "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "pageSize": this.pageSize,
        "pageNumber": page,
        "filterType": this.filterType,
        "filterValue": this.filterValue,
        "sortRule": this.sortDirection,
        "channelNameFilter": this.channelNameFilter.join(','),
        "eventNameFilter": this.eventNameFilter.join(','),
        "hideStreamFilter": this.isHideStreamFilter,
        "licenseCategoryFilter": this.licenseCategory.join(',')
      }
    },
    setVdRecordCondition(page: number) {
      this.conditionForVdApi = {
        "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
        "pageSize": this.pageSize,
        "pageNumber": page,
        "filterType": this.filterType,
        "filterValue": this.filterValue,
        "sortRule": this.sortDirection,
        "channelNameFilter": this.channelNameFilter.join(','),
        "eventNameFilter": this.eventNameFilter.join(','),
        "hideStreamFilter": this.isHideStreamFilter,
        "eventTypeFilter": this.eventType.join(',')
      }
    },
    async getTfaRecord() {
      try {
        await useAuthStore().refreshTokenApi()
        const condition = {
          "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "period": this.timeInterval,
          "carType": this.carType.join(','),
          "filterType": this.filterType,
          "filterValue": this.filterValue,
          "channelNameFilter": this.channelNameFilter.join(','),
          "eventNameFilter": this.eventNameFilter.join(','),
          "hideStreamFilter": this.isHideStreamFilter
        }
        const result = await recordApi.getTfaRecord(JSON.stringify(condition));
        this.allDataList = result.data.record
        this.allDataList.forEach((i: any) => i.startTime = this.transformUtc(i.startTime))
        this.allDataList.forEach((i: any) => i.endTime = this.transformUtc(i.endTime))
      } catch (error: any) {
        console.log(error)
      }
    },

    async getRecordByPageApi(page: number = 1) {
      try {
        this.isDataLoaded = false
        this.recordTfaList = []
        this.recordLpdrList = []
        this.recordVdList = []

        await useAuthStore().refreshTokenApi()

        let condition
        let result
        switch (this.currentType) {
          case 'tableTFA':
            this.setTfaRecordCondition(page)
            condition = this.conditionForTfaApi
            result = await recordApi.getTfaRecordByPage(JSON.stringify(condition));
            this.recordTfaList = result.data.record
            this.recordTfaList.forEach(i => i.startTime = this.transformUtc(i.startTime))
            this.recordTfaList.forEach(i => i.endTime = this.transformUtc(i.endTime))
            this.recordTfaSumList = result.data.totalCount
            break
          // 增加從graph路由直接切換到Table路由的狀況
          case "graph":
            this.setTfaRecordCondition(page);
            condition = this.conditionForTfaApi;
            result = await recordApi.getTfaRecordByPage(
              JSON.stringify(condition)
            );
            this.recordTfaList = result.data.record;
            this.recordTfaSumList = result.data.totalCount;
            break;
          case 'tableLPDR':
            this.setLpdrRecordCondition(page)
            condition = this.conditionForLpdrApi
            result = await recordApi.getLpdrRecordByPage(JSON.stringify(condition));
            this.recordLpdrList = result.data
            this.recordLpdrList.forEach(i => i.time = this.transformUtc(i.time))
            break
          case 'tableVD':
            this.setVdRecordCondition(page)
            condition = this.conditionForVdApi
            result = await recordApi.getVdRecordByPage(JSON.stringify(condition));
            this.recordVdList = result.data
            this.recordVdList.forEach(i => i.time = this.transformUtc(i.time))
            break
        }

        this.isDataLoaded = true
      } catch (error: any) {
        console.log(error)
      }
    },
    async getRecordTotalPageApi() {
      try {
        this.totalPage = 1
        this.totalItem = 0
        this.isPageNoLoaded = false
        const data = {
          "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "period": this.timeInterval,
          "pageSize": 20,
          "filterType": this.filterType,
          "filterValue": this.filterValue,
          "channelNameFilter": this.channelNameFilter.join(','),
          "eventNameFilter": this.eventNameFilter.join(','),
          "hideStreamFilter": this.isHideStreamFilter
        }
        let result

        switch (this.currentType) {
          case 'tableTFA':
            result = await recordApi.getTfaRecordTotalPage(JSON.stringify(data));
            this.totalPage = result.data.totalPage
            this.totalItem = result.data.totalItem
            break
          // 增加從graph路由直接切換到Table路由的狀況
          case "graph":
            result = await recordApi.getTfaRecordTotalPage(
              JSON.stringify(data)
            );
            this.totalPage = result.data.totalPage;
            this.totalItem = result.data.totalItem;
            break;
          case 'tableLPDR':
            const tempData = {
              ...data,
              "licenseCategoryFilter": this.licenseCategory.join(',')
            };
            result = await recordApi.getLpdrRecordTotalPage(JSON.stringify(tempData));
            this.totalPage = result.data.totalPage
            this.totalItem = result.data.totalItem
            break
          case 'tableVD':
            const newData = {
              ...data,
              "eventTypeFilter": this.eventType.join(',')
            };
            result = await recordApi.getVdRecordTotalPage(JSON.stringify(newData));
            this.totalPage = result.data.totalPage
            this.totalItem = result.data.totalItem
            break
        }
        this.isPageNoLoaded = true
      } catch (error: any) {
        console.log(error)
      }
    },
    async getLpdrRecord() {
      try {
        await useAuthStore().refreshTokenApi()
        const condition = {
          "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "filterType": this.filterType,
          "filterValue": this.filterValue,
          "channelNameFilter": this.channelNameFilter.join(','),
          "eventNameFilter": this.eventNameFilter.join(','),
          "hideStreamFilter": this.isHideStreamFilter
        }
        const result = await recordApi.getLpdrRecord(JSON.stringify(condition));
        this.allDataList = result.data
        this.allDataList.forEach((i: any) => i.time = this.transformUtc(i.time))
      } catch (error: any) {
        console.log(error)
      }
    },
    async getVdRecord() {
      try {
        await useAuthStore().refreshTokenApi()
        const condition = {
          "sTime": moment(this.startPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "eTime": moment(this.endPeriod.toUTCString(), "ddd, DD MMM YYYY HH:mm:ss [GMT]").format("YYYY-MM-DDTHH:mm:ss"),
          "filterType": this.filterType,
          "filterValue": this.filterValue,
          "channelNameFilter": this.channelNameFilter.join(','),
          "eventNameFilter": this.eventNameFilter.join(','),
          "hideStreamFilter": this.isHideStreamFilter,
        }
        const result = await recordApi.getVdRecord(JSON.stringify(condition));
        this.allDataList = result.data
        this.allDataList.forEach((i: any) => i.time = this.transformUtc(i.time))
      } catch (error: any) {
        console.log(error)
      }
    },
    async getImageAndBoundApi(id: string) {
      try {
        await useAuthStore().refreshTokenApi()
        const result = await recordApi.getImageAndBound(id);
        this.screenShot = result.data
        if (this.screenShot.imageData) this.isScreenshotExisted = true
        this.isImageImported = true

      } catch (error: any) {
        this.isImageImported = true
        this.isScreenshotExisted = false
        swalErrorModal.fire(t('swalErrorModal.Failed_to_access_screenshot'))
        console.log(error)
      }
    },
    async getVideoApi(id: string) {
      try {
        await useAuthStore().refreshTokenApi()
        const result = await recordApi.getVideo(id);
        if (result.data.success) return result.data.anyObject
      } catch (error: any) {
        console.log(error)
      }
    },
    async getDropdownListApi() {
      try {
        await useAuthStore().refreshTokenApi()
        let result
        switch (this.currentType) {
          case "tableTFA":
            result = await recordApi.getTfaDropdownList();
            this.filterDropDownList = result.data;
            break;
          // 增加從graph路由直接切換到Table路由的狀況
          case "graph":
            result = await recordApi.getTfaDropdownList();
            this.filterDropDownList = result.data;
            break;
          case "tableLPDR":
            result = await recordApi.getLpdrDropdownList();
            this.filterDropDownList = result.data;
            break;
          case "tableVD":
            result = await recordApi.getVdDropdownList();
            this.filterDropDownList = result.data;
            break;
        }
        return result;
      } catch (error: any) {
        console.log(error);
      }
    },
  },
});
