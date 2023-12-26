import { defineStore } from "pinia";
import type { CameraSchema } from '@/composables/models'
import { Camera } from '@/composables/models'
import { channelApi } from '@/apis'
import { useChannelStore, useAuthStore } from '@/stores'

export const useImportChannelStore = defineStore({
  id: 'importChannel',

  state: () => ({
    importItem: 'stream',
    isImportStream: true,
    importChannel: new Camera(),
    isImportChannelModalOpen: false,
    currentImportChannelModalPage: 1,
  }),

  getters: {
    // doubleCount: (state) => state.count * 2,
  },

  actions: {
    turnOnImportChannelModal() {
      this.isImportChannelModalOpen = true
    },
    turnOffImportChannelModal() {
      this.isImportChannelModalOpen = false
      // this.importItem = ''
      this.isImportStream = true
      this.currentImportChannelModalPage = 1
      this.importChannel = new Camera()
    },
    chooseImportItem(item: string) {
      this.importItem = item
    },
    saveImportChannel(data: CameraSchema) {
      this.importChannel = data
    },
    cleanImportChannel() {
      this.importChannel = new Camera()
    },
    toNextPage() {
      this.currentImportChannelModalPage++
    },
    toPreviousPage() {
      this.currentImportChannelModalPage--
      if (this.currentImportChannelModalPage === 0) {
        this.importItem = ''
      }
    },
    checkRepeatChannel(): boolean[] {
      const importName: string = this.importChannel.channelName
      const importUrl: string = this.importChannel.ip
      const existedList: CameraSchema[] = useChannelStore().camList
      const isNameRepeat: boolean = existedList.some(i => { return i.channelName === importName })
      const isUrlRepeat: boolean = existedList.some(i => { return i.ip === importUrl })
      return [isNameRepeat, isUrlRepeat]
    },
    checkUnfilled(): boolean[] {
      const { channelName, ip, account, password, coordinates } = this.importChannel
      const list = [channelName, ip, account, password, coordinates]
      const result: boolean[] = list.map(i => { return Object.keys(i).length === 0 ? true : false })
      return result
    },
    checkUrl(): boolean {
      const { ip } = this.importChannel
      const regExp = new RegExp(/rtsp:\/\//, "i")
      const _bool = regExp.test(ip)
      return !_bool
    },
    async increaseChannelApi() {
      try {
        await useAuthStore().refreshTokenApi()
        let data: any = this.importChannel
        delete data.streamId
        data.ip = data.ip.substring(0, 4).toLowerCase() + data.ip.substring(4);

        const result = await channelApi.importChannel(JSON.stringify(data));

        return result.status
      } catch (error: any) {
        const errorStatus: number = error.response.status
        console.log(error)
        return errorStatus
      }
    },
    async increaseVideoApi() {
      try {
        await useAuthStore().refreshTokenApi()
        const formData = new FormData();
        formData.append('channelName', this.importChannel.channelName);
        formData.append('videoFile', this.importChannel.videoFile!);
        let a = formData.get('videoFile')

        const result = await channelApi.importVideo(formData);

        return result.status
      } catch (error: any) {
        const errorStatus: number = error.response.status
        console.log(error)
        return errorStatus
      }
    }
  },
})