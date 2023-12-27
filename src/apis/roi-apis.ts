import { apiHelper } from '@/composables/apiHelper'
import { getCookie } from '@/composables/cookie'
import type { Rule } from '@/composables/models'

export const roiApi = {
  getRuleList(id: string, type?: string) {
    return apiHelper.get(`/Rule/GetRuleList`, { params: { streamId: id, systemType: type }, headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getRule(ruleId: string) {
    return apiHelper.get(`/Rule/GetRule/${ruleId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getRuleCount(id?: string) {
    return apiHelper.get(`/Rule/GetUsedCount`, { params: { streamId: id }, headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getTotalRuleCount() {
    return apiHelper.get(`/Rule/GetUsedCount`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  editRule(data: string) {
    return apiHelper.put('/Rule/ModifyRule', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteRule(ruleId: string) {
    return apiHelper.delete(`/Rule/RemoveRule/${ruleId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  //新增轉向車流偵測
  importDoubleAnalyticsDetec(data: string) {
    return apiHelper.post('/Rule/ImportDoubleAnalyticsDetec', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增單向車流偵測
  importSingleAnalyticsDetec(data: string) {
    return apiHelper.post('/Rule/ImportSingleAnalyticsDetec', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增紅燈右轉偵測
  importRedLightRightTurnViolation(data: string) {
    return apiHelper.post('/Rule/ImportRedLightRightTurnViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增紅燈左轉偵測
  importRedLightLeftTurnViolation(data: string) {
    return apiHelper.post('/Rule/ImportRedLightLeftTurnViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增闖紅燈偵測
  importRedLightViolation(data: string) {
    return apiHelper.post('/Rule/ImportRedLightViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增未依行專用道行駛(逆向)偵測
  importWrongWayDrivingViolation(data: string) {
    return apiHelper.post('/Rule/ImportWrongWayDrivingViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增跨越雙白雙黃線偵測
  importCrossingDoubleLineViolation(data: string) {
    return apiHelper.post('/Rule/ImportCrossingDoubleLineViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增違停偵測
  importParkingViolation(data: string) {
    return apiHelper.post('/Rule/ImportParkingViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增汽車停等機車停等區偵測
  importVehicleExceptMotorbikeTripwireViolation(data: string) {
    return apiHelper.post('/Rule/ImportVehicleExceptMotorbikeTripwireViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增未保持路口淨空偵測
  importVehicleTripwireWithSignalViolation(data: string) {
    return apiHelper.post('/Rule/ImportVehicleTripwireWithSignalViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增機車行駛禁行機車道偵測
  importMotorbikeTripwireViolation(data: string) {
    return apiHelper.post('/Rule/ImportMotorbikeTripwireViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增未禮讓行人偵測
  importVehicleTripwireIfPedestrianExistsViolation(data: string) {
    return apiHelper.post('/Rule/ImportVehicleTripwireIfPedestrianExistsViolation', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  //新增車辨
  importLicensePlate(data: string) {
    return apiHelper.post('/Rule/ImportLicensePlate', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  }
}