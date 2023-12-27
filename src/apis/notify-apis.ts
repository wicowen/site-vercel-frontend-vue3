import { apiHelper } from '@/composables/apiHelper'
import { getCookie } from '@/composables/cookie'

export const notifyApi = {
  getNotifyList() {
    return apiHelper.get('/Inform/GetInformList', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getSignalR() {
    return apiHelper.get('/Inform/GetSignalR', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getBlackListFile(informId: string) {
    return apiHelper.get(`/Inform/GetBlackListFile/${informId}`, { headers: { Token: `Bearer ${getCookie('token')}` }, responseType: 'blob' })
  },
  readNotify(informId: string) {
    return apiHelper.put(`/Inform/BeRead/${informId}`, '', { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  readAllNotify() {
    return apiHelper.put(`/Inform/AllBeRead`, '', { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },

  createReportSetting(data: any) {
    return apiHelper.post('/Notify/CreateNotifyByEZPro', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  testEzproReport(data: any) {
    return apiHelper.post('/Notify/TestMessageByEZPro', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  updateReportOnOff(data: any) {
    return apiHelper.put('/Notify/UpdateNotifyOnOff', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  editReportSetting(data: any) {
    return apiHelper.put('/Notify/UpdateNotify', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteReport(notifyId: string) {
    return apiHelper.delete(`/Notify/DeleteNotify/${notifyId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  }
}