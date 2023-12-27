import { apiHelper } from '@/composables/apiHelper'
import { getCookie } from '@/composables/cookie'

export const blocklistApi = {
  getBlocklist(data: any) {
    return apiHelper.post('/Notify/QueryLicensePlate',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getBlocklistByPage(data: any) {
    return apiHelper.post('/Notify/QueryLicensePlateByPage',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getBlocklistTotalPage(data: any) {
    return apiHelper.post('/Notify/QueryPageSetting',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  ImportLicensePlateFile(data: FormData) {
    return apiHelper.post('/Notify/ImportLicensePlateFile',
      data, {
      headers: { 'Content-Type': 'multipart/form-data', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getWaitingFiles() {
    return apiHelper.get('/Notify/GetWaitingFiles', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  editLicensePlate(data: any) {
    return apiHelper.put('/Notify/UpdateLicensePlate', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteLicensePlate(licensePlateId: string) {
    return apiHelper.delete(`/Notify/DeleteLicensePlate/${licensePlateId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  deleteLicensePlates(data: any) {
    return apiHelper.delete('/Notify/DeleteLicensePlates', { data, headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  getSampleFiles() {
    return apiHelper.get('/Notify/DownloadSample', { headers: { Token: `Bearer ${getCookie('token')}` } })
  }
}