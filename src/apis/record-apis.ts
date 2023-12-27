import { apiHelper } from '@/composables/apiHelper'
import { getCookie } from '@/composables/cookie'

export const recordApi = {
  getTfaRecord(data: any) {
    return apiHelper.post('/Record/QueryCountRecord',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getTfaRecordByPage(data: any) {
    return apiHelper.post('/Record/QueryCountRecordByPage',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getTfaRecordTotalPage(data: any) {
    return apiHelper.post('/Record/QueryPageSetting',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getLpdrRecord(data: any) {
    return apiHelper.post('/Record/QueryRecordOfLPDR',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getLpdrRecordByPage(data: any) {
    return apiHelper.post('/Record/QueryRecordOfLPDRByPage',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getLpdrRecordTotalPage(data: any) {
    return apiHelper.post('/Record/QueryPageSettingOfLPDR',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getVdRecord(data: any) {
    return apiHelper.post('/Record/QueryRecordOfVD',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getVdRecordByPage(data: any) {
    return apiHelper.post('/Record/QueryRecordOfVDByPage',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },
  getVdRecordTotalPage(data: any) {
    return apiHelper.post('/Record/QueryPageSettingOfVD',
      data, {
      headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` }
    })
  },

  getImage(recordId: string) {
    return apiHelper.get(`/Record/GetImage/${recordId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getImageAndBound(recordId: string) {
    return apiHelper.get(`/Record/GetImageAndBound/${recordId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getVideo(recordId: string) {
    return apiHelper.get(`/Record/GetVideo/${recordId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getTfaDropdownList() {
    return apiHelper.get('/Record/GetDropDownList', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getLpdrDropdownList() {
    return apiHelper.get('/Record/GetDropDownListOfLPDR', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getVdDropdownList() {
    return apiHelper.get('/Record/GetDropDownListOfVD', { headers: { Token: `Bearer ${getCookie('token')}` } })
  }


}