import { nextTick } from "vue"
import { defineStore } from "pinia";
import { useChannelStore, useAuthStore } from '@/stores'
import { roiApi } from '@/apis'
import { useRoute } from "vue-router";
import type { Rule, RuleBody, RuleUsedCount, Length, Point, Rect } from '@/composables/models'
import { RoiStyle } from "@/composables/models";
import i18n from "@/plugins/i18n";
const { t } = i18n.global;
export const useRoilStore = defineStore({
    id: 'roi',
    state: () => ({
        isDataSaving: <boolean>false,
        isTutorialPopupShow: <boolean>true,
        tutorialStep: <number>0,
        tutorialType: <string>'',
        isTutorialOpen: <boolean>false,
        nextStepTiming: <number>0,
        preStepTiming: <number>0,
        isFullScreen: <boolean>false,
        isScreenshotRatioFourToThree: <boolean>false,
        isRestrictNextStep: <boolean>true,
        colorMode: <string>'startRoi',
        isDrawStartRoi: <boolean>true,
        isDrawEndRoi: <boolean>false,
        isDrawTrafficSignal: <boolean>false,
        isInputData: <boolean>false,
        currentEventType: <string>'TFA',
        currentAddEvent: <string>'',
        currentCanvasLength: <Length>{},
        selectedChannelEventList: <Rule[]>[],
        selectedChannelRuleCount: <RuleUsedCount[]>[],
        selectedRuleId: <string>'',
        newRule: <Rule>{},
        editRule: <Rule | undefined>{},
        query: useRoute().query,
        eventCatalog: {
            TFA: {
                DoubleAnalyticsDetec: t('channel.ROI_title.turn_detection'),
                SingleAnalyticsDetec: t('channel.ROI_title.one_way_detection'),
            },
            VD: {
                RedLightRightTurnViolation: t('channel.ROI_title.red_light_turn_right'),
                RedLightLeftTurnViolation: t('channel.ROI_title.red_light_turn_left'),
                RedLightViolation: t('channel.ROI_title.run_the_red_light'),
                WrongWayDrivingViolation: t('channel.ROI_title.violating_one_way_lane'),
                CrossingDoubleLineViolation: t('channel.ROI_title.crossing_double_whiteyellow_lines'),
                ParkingViolation: t('channel.ROI_title.illegal_parking'),
                VehicleExceptMotorbikeTripwireViolation: t('channel.ROI_title.occupying_motorbike_waiting_area'),
                VehicleTripwireWithSignalViolation: t('channel.ROI_title.fail_to_keep_clear_at_intersection'),
                MotorbikeTripwireViolation: t('channel.ROI_title.no_motorbike_lane'),
                VehicleTripwireIfPedestrianExistsViolation: t('channel.ROI_title.not_yielding_to_persons')
            },
            LPDR: {}
        }
    }),

    getters: {
        roiStyle: (state) => {
            let style = new RoiStyle();
            if (state.isDrawStartRoi) {
                style.fillColor = "#31FF9033";
                style.borderColor = "#31FF90";
                style.borderWidth = 2;
            }
            if (state.isDrawEndRoi) {
                style.fillColor = "#FFDD434D";
                style.borderColor = "#FFDD43";
                style.borderWidth = 2;
            }
            if (state.isDrawTrafficSignal) {
                style.fillColor = "#FF9D824D";
                style.borderColor = "#FF754F";
                style.borderWidth = 2;
            }
            return style;
        }
    },

    actions: {
        switchEventType(event: string) {
            this.currentEventType = event
        },
        setSelectedRuleId(_id: string) {
            this.selectedRuleId = _id
        },
        storeCurrentCanvasLength(width: number, height: number) {
            this.currentCanvasLength.width = width
            this.currentCanvasLength.height = height
        },
        returnImageType(ratio: number) {  //to decide fullscreen ratio
            if (ratio > 0.65) {
                this.isScreenshotRatioFourToThree = true //ratio 4:3 (0.75)
            } else {
                this.isScreenshotRatioFourToThree = false //ratio 16:9 (0.5625)
            }
        },
        toggleFullScreen() {
            this.isFullScreen = !this.isFullScreen
        },
        transformPoint(_points: Point[], width: number, height: number): Point[] {
            const deNormalize = (point: Point): Point => {
                const result: Point = { x: 0, y: 0 }
                result.x = point.x * width
                result.y = point.y * height
                return result
            }
            return _points.map(i => deNormalize(i))
        },
        transformRect(_rect: Rect, width: number, height: number): Rect {
            const temp: Rect = { height: 0, width: 0, x: 0, y: 0 }
            if (_rect.height !== 0 && _rect.width !== 0) {
                temp.height = _rect.height * height
                temp.width = _rect.width * width
                temp.y = _rect.y * height
                temp.x = _rect.x * width
            }
            return temp
        },
        saveRuleBody(item: RuleBody) {
            const newItem: RuleBody = { area: [{ points: [] }], trafficSignal: <Rect>{} }
            const normalize = (point: Point): Point => {
                const result: Point = { x: 0, y: 0 }
                result.x = point.x / this.currentCanvasLength.width
                result.y = point.y / this.currentCanvasLength.height
                if (result.x > 1) result.x = 1
                if (result.x < 0) result.x = 0
                if (result.y > 1) result.y = 1
                if (result.y < 0) result.y = 0
                return result
            }
            const normalizedArea = item.area.map(i => {
                return { points: i.points.map(normalize) }
            })

            if (item.trafficSignal.height) {
                const normalizedSignal: Rect = { height: 0, width: 0, x: 0, y: 0 }
                normalizedSignal.height = item.trafficSignal.height / this.currentCanvasLength.height
                normalizedSignal.width = item.trafficSignal.width / this.currentCanvasLength.width
                normalizedSignal.y = item.trafficSignal.y / this.currentCanvasLength.height
                normalizedSignal.x = item.trafficSignal.x / this.currentCanvasLength.width
                newItem.trafficSignal = normalizedSignal
            }
            normalizedArea.forEach((item, index) => { newItem.area[index] = item })
            this.newRule.ruleBody = newItem
        },
        saveRule(eventName: string, id: string, mode: string, timer?: number) {
            this.newRule.eventName = eventName
            if (mode === "add") {
                this.newRule.streamId = id
            } else if (mode === "edit") {
                this.newRule.ruleId = id
            }
            if (timer) this.newRule.ruleBody.timer = timer
        },
        RestrictNextStep(_bool: boolean) {
            this.isRestrictNextStep = _bool
        },
        switchMode(mode: string) {
            switch (mode) {
                case 'startRoi':
                    this.isDrawStartRoi = true
                    this.isDrawEndRoi = false
                    this.isDrawTrafficSignal = false
                    this.isInputData = false
                    this.colorMode = 'startRoi'
                    break
                case 'endRoi':
                    this.isDrawStartRoi = false
                    this.isDrawEndRoi = true
                    this.isDrawTrafficSignal = false
                    this.isInputData = false
                    this.colorMode = 'endRoi'
                    break
                case 'trafficSignal':
                    this.isDrawStartRoi = false
                    this.isDrawEndRoi = false
                    this.isDrawTrafficSignal = true
                    this.isInputData = false
                    this.colorMode = 'trafficSignal'
                    break
                case 'inputData':
                    this.isDrawStartRoi = false
                    this.isDrawEndRoi = false
                    this.isDrawTrafficSignal = false
                    this.isInputData = true
                    this.colorMode = 'inputData'
                    break
            }
        },
        roiReset() {
            this.isDrawStartRoi = true
            this.isDrawEndRoi = false
            this.isDrawTrafficSignal = false
            this.isInputData = false
            this.isRestrictNextStep = true
            this.isFullScreen = false
            this.newRule = <Rule>{}
            this.selectedRuleId = ''
        },
        toNextStep() {
            this.nextStepTiming = Date.now();
        },
        toPreStep() {
            this.preStepTiming = Date.now();
        },
        saveCurrentAddEvent(event: string) {
            this.currentAddEvent = event
        },
        getCurrentRule(_id: string): Rule {
            const temp: Rule | undefined = this.selectedChannelEventList.find(i => { return i.ruleId === _id })
            return temp!
        },
        async getRuleListApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const isIdExisted = (): boolean => {
                    const condition = undefined || ''
                    if (useChannelStore().selectedChannelId === condition) return false
                    return true
                }
                const id: string = isIdExisted() ? useChannelStore().selectedChannelId : this.query.id as string
                const result = await roiApi.getRuleList(id);
                this.selectedChannelEventList = result.data
            } catch (error: any) {
                // const errorStatus: number = error.response.status
                console.log(error)
            }
        },
        async getRuleApi() {
            try {
                await useAuthStore().refreshTokenApi()
                const id: string = this.selectedRuleId ? this.selectedRuleId : this.query.ruleId as string
                const result = await roiApi.getRule(id);
                this.editRule = result.data
            } catch (error: any) {
                // const errorStatus: number = error.response.status
                console.log(error)
            }
        },
        async getRuleCountApi() {
            try {
                this.selectedChannelRuleCount = []
                await useAuthStore().refreshTokenApi()
                const isIdExisted = (): boolean => {
                    const condition = undefined || ''
                    if (useChannelStore().selectedChannelId === condition) return false
                    return true
                }
                const id: string = isIdExisted() ? useChannelStore().selectedChannelId : this.query.id as string
                const result = await roiApi.getRuleCount(id);
                if (result.data.length === 0) return
                result.data.forEach((i: { group: { systemType: any; }; count: any; }) => {
                    let temp: RuleUsedCount = {
                        type: i.group.systemType,
                        count: i.count
                    }
                    this.selectedChannelRuleCount.push(temp)
                })
            } catch (error: any) {
                this.selectedChannelRuleCount = []
                console.log(error)
            }
        },
        async getTotalRuleCountApi() {
            try {
                const result = await roiApi.getTotalRuleCount();
                return result.data
            } catch (error: any) {
                console.log(error)
            }
        },
        async editRuleApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule
                // delete data.id
                const result = await roiApi.editRule(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        async deleteRuleApi(id: string) {
            try {
                await useAuthStore().refreshTokenApi()
                const result = await roiApi.deleteRule(id);

            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)

            }
        },
        //新增轉向車流偵測
        async importDADApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importDoubleAnalyticsDetec(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增單向車流偵測
        async importSADApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importSingleAnalyticsDetec(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增紅燈右轉偵測
        async importRLRTVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importRedLightRightTurnViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增紅燈左轉偵測
        async importRLLTVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importRedLightLeftTurnViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增闖紅燈偵測
        async importRLVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importRedLightViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增未依行專用道行駛(逆向)偵測
        async importWWDVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importWrongWayDrivingViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增跨越雙白雙黃線偵測
        async importCDLVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importCrossingDoubleLineViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增違停偵測
        async importPVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importParkingViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增汽車停等機車停等區偵測
        async importVEMTVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importVehicleExceptMotorbikeTripwireViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增未保持路口淨空偵測
        async importVTWSVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importVehicleTripwireWithSignalViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增機車行駛禁行機車道偵測
        async importMTVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importMotorbikeTripwireViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增未禮讓行人偵測
        async importVTIPEVApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importVehicleTripwireIfPedestrianExistsViolation(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
        //新增車辨
        async importLPRApi(): Promise<number> {
            try {
                await useAuthStore().getSentinelStatusApi()
                if (useAuthStore().authStatus === false) return 401
                let data: Rule = this.newRule

                const result = await roiApi.importLicensePlate(JSON.stringify(data));

                return result.status
            } catch (error: any) {
                const errorStatus: number = error.response.status
                console.log(error)
                return errorStatus
            }
        },
    }
})