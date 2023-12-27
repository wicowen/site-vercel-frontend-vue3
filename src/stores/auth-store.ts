import { defineStore } from "pinia";
import type { CurrentUser } from '@/composables/models'
import router from "@/router";
import { authApi, settingApi } from '@/apis'
import { setCookie, getCookie } from '@/composables/cookie'
import { useChannelStore } from '@/stores'
import AES from 'crypto-js/aes'
import { lib } from 'crypto-js'
import Utf8 from 'crypto-js/enc-utf8'
import encUtf8 from 'crypto-js/enc-utf8';

export const useAuthStore = defineStore({

    id: 'authentication',

    state: () => ({
        token: getCookie('token'),
        authStatus: <boolean>false,
        returnUrl: '',
        currentUser: <CurrentUser>{},
        refreshTiming: <number>0,
        isFinishLoginProcess: <boolean>true,
        isLicenseFull: <boolean>false,
        secretKey: 'U2FsdGVkX18qFklokiQE3tbHIl4Hft5Cdj3yeX4ZeEo='
    }),

    actions: {
        setAuthStatus(_bool: boolean) {
            this.authStatus = _bool
        },
        logout() {
            useChannelStore().setSelectedChannelId('')
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push('/login');
        },
        //密碼AES加密
        encryptPassword(password: string) {
            const key = Utf8.parse(this.secretKey)
            let iv = lib.WordArray.create([2703151127, 1775954017, 1323287681, 1902108193])
            const cipherText = AES.encrypt(password, key, { iv }).toString()
            return cipherText
        },
        //密碼AES解密
        decryptPassword(cipherText: string) {
            const key = Utf8.parse(this.secretKey)
            let iv = lib.WordArray.create([2703151127, 1775954017, 1323287681, 1902108193])
            var bytes = AES.decrypt(cipherText, key, { iv });
            var originalObj = bytes.toString(encUtf8)
            return originalObj
        },
        async login(_user: CurrentUser) {
            try {
                this.isFinishLoginProcess = false
                const result = await authApi.signIn(_user.account, _user.password);
                // update pinia state
                this.currentUser = _user;
                this.token = result.data;
                setCookie('token', result.data, 10)
                this.isFinishLoginProcess = true
                router.push(this.returnUrl || '/');
                return result.status
            } catch (error: any) {
                this.isFinishLoginProcess = true
                if (error instanceof DOMException) return 0
                if (error.message === 'Network Error') return 0
                const errorStatus: number = error.response.status
                return errorStatus
            }
        },

        async refreshTokenApi() {
            try {
                const lastTime = this.refreshTiming
                const now = Math.floor(Date.now() / 1000)
                if (now - lastTime < 1800) return

                const result = await authApi.refreshToken()
                setCookie('token', result.data, 10)
                this.refreshTiming = now
            } catch (error: any) {
                const errorStatus: number = error.response.status
                if (errorStatus === 401) this.logout()
                console.log(error)
            }
        },

        async ezproAuthenticate(username: string, password: string) {
            try {
                const result = await authApi.reqEzproAuth(username, password)
                setCookie('x-runtime-guid', result.data.token, 10)
                await this.testAuthenticate(result.data.token)
                return result.data.token
            } catch (error: any) {
                console.log(error)
            }
        },
        async testAuthenticate(token: string) {
            try {
                const result = await authApi.testEzpro(token)
            } catch (error: any) {
                console.log(error)
            }
        },
        async getLicenseStatusApi() {
            try {
                const result = await settingApi.getLicenseStatus()
                if (result.data.status === 1) this.authStatus = true
                else if (result.data.status === 2) this.authStatus = false
                else if (result.data.status === 0) this.authStatus = result.data.amountOfLicense > 0 ? true : false
                this.isLicenseFull = result.data.amountOfUsing >= result.data.amountOfLicense
                return result.data.amountOfUsing >= result.data.amountOfLicense
            } catch (error: any) {
                console.log(error)
            }
        },
        async getSentinelStatusApi() {
            try {
                const result = await settingApi.getSentinelStatus()
                if (typeof result === 'boolean') this.authStatus = result
            } catch (error: any) {
                console.log(error)
            }
        }
    }
})
