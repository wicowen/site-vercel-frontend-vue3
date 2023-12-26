import { defineStore } from "pinia";
import router from "@/router";
import { useAuthStore } from "@/stores";
import { channelApi } from "@/apis";
import type { CameraSchema, ChannelStatus } from "@/composables/models";
import { setCookie } from "@/composables/cookie";
import { swalErrorModal } from "@/composables/swalModal";
import { useI18n } from "vue-i18n";

export const useChannelStore = defineStore({
  id: "channel",
  state: () => ({
    camList: <CameraSchema[]>[],
    isVideoLoaded: <boolean>false,
    selectedChannelId: "",
    currentScreenshot: <HTMLVideoElement | null>null,
    videoWidth: <number | null>null,
    videoHeight: <number | null>null,
    videoRatio: <number>1.77777,
    channelStatusList: <ChannelStatus[]>[],
    currentChannelStatus: <boolean>true,
    isRoiModalJustClosed: <boolean>false,
    useI18n: useI18n(),
  }),

  getters: {
    videoLengthRatio: (state) => {
      if (state.videoHeight && state.videoWidth)
        return state.videoHeight / state.videoWidth;
    },
  },

  actions: {
    setEzproIdCookie(_id: string) {
      const channel = this.ReturnCurrentChannel(_id);
      if (channel?.ip !== null) {
        const ip = channel?.ip.substring(
          channel?.ip.length - 40,
          channel?.ip.length - 4
        );
        setCookie("ezproId", ip, 10);
      }
    },
    getVideoLength(width: number, height: number) {
      if (width !== 0 || height !== 0) {
        this.videoWidth = width;
        this.videoHeight = height;
      }
    },
    saveScreenshot(image: HTMLVideoElement) {
      this.currentScreenshot = image;
    },
    ReturnCurrentChannel(_id: string) {
      let channel = this.camList.find((item) => {
        return item.streamId === _id;
      });
      return channel;
    },
    setSelectedChannelId(_id: string) {
      this.selectedChannelId = _id;
    },
    changeChannel(_id: string) {
      //if (_id === this.selectedChannelId) return
      this.setSelectedChannelId(_id);
      this.setEzproIdCookie(_id);
      router.push({ query: { id: _id } });
    },
    async getChannelApi(id: string) {
      try {
        await useAuthStore().refreshTokenApi();
        const result = await channelApi.getChannel(id);
        return result.data;
      } catch (error: any) {
        console.log(error);
      }
    },
    async getChannelResolutionApi(id: string) {
      try {
        const result = await channelApi.getChannelResolution(id);
        return result.data;
      } catch (error: any) {
        console.log(error);
      }
    },
    async getAllChannelApi() {
      try {
        await useAuthStore().refreshTokenApi();
        const channelList = await channelApi.getChannelList();
        // 處理資料邏輯
        let tempList: CameraSchema[] = channelList.data;
        // 每支串流的側邊攔下拉式選單預設為關閉，並顯示各偵測區結果
        this.camList = tempList.map((item) =>
          Object.assign(
            {},
            item,
            { dropdownStatus: false },
            { camStatus: "connect" },
            { isTFAOpen: true },
            { isVDOpen: true },
            { isLPDROpen: true }
          )
        );
      } catch (error: any) {
        console.log(error);
      }
    },
    async getChannelStatusListApi() {
      try {
        const statusList = await channelApi.getChannelStatusList();
        this.channelStatusList = statusList.data;
        //套入每支攝影機的狀態
        this.camList.forEach((cam) => {
          let result = this.channelStatusList.filter((i) => {
            return i.id === cam.streamId;
          });
          cam.camStatus = result[0].connected ? "connect" : "disconnect";
        });
      } catch (error: any) {
        console.log(error);
      }
    },
    async getChannelStatusApi(url: string, account: string, password: string) {
      try {
        await useAuthStore().refreshTokenApi();
        const result = await channelApi.getChannelStatus(
          url,
          account,
          password
        );
        this.currentChannelStatus = result.data.success;
      } catch (error: any) {
        const { t } = this.useI18n;

        this.currentChannelStatus = false;
        console.log(error);

        if (error.code === "ERR_BAD_REQUEST")
          swalErrorModal.fire(
            t("swalErrorModal.Failed_to_establish_connection_with_stream")
          );
      }
    },
    async deleteChannelApi(id: string) {
      try {
        await useAuthStore().refreshTokenApi();
        const result = await channelApi.deleteChannel(id);
      } catch (error: any) {
        console.log(error);
      }
    },
  },
});
