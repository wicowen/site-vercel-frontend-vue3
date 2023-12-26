import { defineStore } from "pinia";
import type { CameraSchema } from '@/composables/models'
import { Camera } from '@/composables/models'
import { channelApi } from '@/apis'
import { useChannelStore, useAuthStore } from '@/stores'
import { swalCenterWarnModal } from '@/composables/swalModal'
import i18n from "@/plugins/i18n";

const { t } = i18n.global;
export const useEditChannelStore = defineStore({
  id: 'EditChannel',

  state: () => ({
    importItem: '',
    isEditStream: true,
    isEditChannelModalOpen: false,
    currentEditChannelModalPage: 1,
    EditChannel: new Camera(),
  }),

  getters: {
    // doubleCount: (state) => state.count * 2,
  },

  actions: {
    turnOnEditChannelModal(videoName: string | undefined) {
      if (videoName === null) {
        this.isEditStream = true
      } else {
        this.isEditStream = false
      }
      this.isEditChannelModalOpen = true
    },
    turnOffEditChannelModal() {
      this.isEditStream = true
      this.isEditChannelModalOpen = false
      this.currentEditChannelModalPage = 1
      this.EditChannel = new Camera()
    },
    async closeWithoutSave() {
      const result = await swalCenterWarnModal.fire({
        html: t('swalCenterWarnModal.The_data_has_not_been_saved_Are_you_sure_to_leave'),
        cancelButtonText: t('swalCenterWarnModal.Cancel'), // 將取消按鈕的文字換成中文
        confirmButtonText: t('swalCenterWarnModal.Confirm') // 將確定按鈕的文字換成中文
    })
      if (result.isConfirmed) {
        this.turnOffEditChannelModal()
      }
    },
    chooseImportItem(item: string) {
      this.importItem = item
    },
    saveEditChannel(data: CameraSchema) {
      this.EditChannel = data
    },
    cleanEditChannel() { 
      this.EditChannel = new Camera()
    },
    toNextEditPage() {
      this.currentEditChannelModalPage++
    },
    toPreviousEditPage() {
      this.currentEditChannelModalPage--
    },
    checkRepeatEditChannel(): boolean[] {
      const importName: string = this.EditChannel.channelName
      const importUrl: string = this.EditChannel.ip
      const existedList: CameraSchema[] = useChannelStore().camList.filter(i => i.streamId !== this.EditChannel.streamId)
      const isNameRepeat: boolean = existedList.some(i => { return i.channelName === importName })
      const isUrlRepeat: boolean = existedList.some(i => { return i.ip === importUrl })
      return [isNameRepeat, isUrlRepeat]
    },
    checkUnfilledEditChannel(): boolean[] {
      const { channelName, ip, account, password, coordinates } = this.EditChannel
      const list = [channelName, ip, account, password, coordinates]
      const result: boolean[] = list.map(i => { return Object.keys(i).length === 0 ? true : false })
      return result
    },
    checkUnfilledEditVideo(): boolean {
      const { channelName } = this.EditChannel
      const result: boolean = channelName.length === 0
      return result
    },
    async getChannelApi() {
      try {
        await useAuthStore().refreshTokenApi()
        const id: string = useChannelStore().selectedChannelId
        const result = await channelApi.getChannel(id);
        this.EditChannel = result.data

      } catch (error: any) {
        const errorStatus: number = error.response.status
        console.log(error)
      }
    },
    async editChannelApi() {
      try {
        await useAuthStore().refreshTokenApi()
        const result = await channelApi.EditChannel(JSON.stringify(this.EditChannel));

        return result.status
      } catch (error: any) {
        const errorStatus: number = error.response.status
        console.log(error)
        return errorStatus
      }
    },
    async editVideoApi(id: string) {
      try {
        await useAuthStore().refreshTokenApi()
        const formData = new FormData();
        formData.append('channelName', this.EditChannel.channelName);
        formData.append('streamId', id);

        const result = await channelApi.editVideo(formData);
        return result.status
      } catch (error: any) {
        const errorStatus: number = error.response.status
        console.log(error)
        return errorStatus
      }
    }
  },
})