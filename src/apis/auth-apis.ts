import { apiHelper } from '@/composables/apiHelper'
// import { ezproHelper } from '@/composables/ezproHelper'
import { getCookie } from '@/composables/cookie'

export const authApi = {
  // reqEzproAuth(account: string, password: string) {
  //   return ezproHelper.post('/rest/v1/login/sessions', { "username": account, "password": password, "setCookie": true })
  // },
  // testEzpro(token: string) {
  //   return ezproHelper.get(`/rest/v1/login/sessions/${token}?setCookie=true`)
  // },
  signIn(account: string, password: string) {
    return apiHelper.post('/Auth/Login', { account, password })
  },
  refreshToken() {
    return apiHelper.post('/Auth/Refresh', null, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getUserList() {
    return apiHelper.get('/Auth/GetUsers', { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getUser(userId: string) {
    return apiHelper.get(`/Auth/GetUser/${userId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  getCurrUser() {
    return apiHelper.get(`/Auth/GetCurrentUser`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  },
  importUser(data: any) {
    return apiHelper.post('/Auth/CreateUser', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  editUserPwd(data: any) {
    return apiHelper.put('/Auth/ResetPassword', data, { headers: { 'Content-Type': 'application/json', Token: `Bearer ${getCookie('token')}` } })
  },
  deleteUser(userId: string, groupId: number) {
    return apiHelper.delete(`/Auth/DeleteUser/${userId}/${groupId}`, { headers: { Token: `Bearer ${getCookie('token')}` } })
  }
}