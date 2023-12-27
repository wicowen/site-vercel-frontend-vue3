import { apiHelper } from '@/composables/apiHelper'
import { getCookie } from '@/composables/cookie'
import type { CameraSchema } from '@/composables/models'

export const channelApi = {
  getChannelList() {
    return apiHelper.get('/Stream/GetChannelList', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getChannel(streamId: string) {
    return apiHelper.get(`/Stream/GetChannel/${streamId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getChannelResolution(streamId: string) {
    return apiHelper.get(`/Stream/GetChannelResolution/${streamId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getChannelStatusList() {
    return apiHelper.get('/Stream/GetChannelStatusList', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getChannelStatus(url: string, account: string, password: string) {
    return apiHelper.get(`/Stream/RtspConnectedWithAuth`, { params: { url: url, account: account, password: password }, headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  importChannel(data: any) {
    return apiHelper.post('/Stream/ImportChannel', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  EditChannel(data: any) {
    return apiHelper.put('/Stream/UpdateChannel', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteChannel(streamId: string) {
    return apiHelper.delete(`/Stream/RemoveChannel/${streamId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  importVideo(data: any) {
    return apiHelper.post('/Stream/ImportVideo', data, { headers: { 'Content-Type': 'multipart/form-data', Token: `Bearer ${getCookie('token')}` } })
  },
  editVideo(data: any) {
    return apiHelper.put('/Stream/UpdateVideo', data, { headers: { 'Content-Type': 'multipart/form-data', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteVideo(streamId: string) {
    return apiHelper.delete(`/Stream/RemoveVideo/${streamId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
}