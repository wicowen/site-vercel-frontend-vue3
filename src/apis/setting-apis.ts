import { apiHelper } from "@/composables/apiHelper";
// import { ezproHelper } from "@/composables/ezproHelper";
import { getCookie } from "@/composables/cookie";

export const settingApi = {
  getReportSettingList() {
    return apiHelper.get("/Notify/GetSettingsByEZPro", {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  getReportSetting(notifyId: string) {
    return apiHelper.get(`/Notify/GetSettingByEZPro/${notifyId}`, {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  createReportSetting(data: any) {
    return apiHelper.post("/Notify/CreateNotifyByEZPro", data, {
      headers: {
        "Content-Type": "application/json",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  testEzproReport(data: any) {
    return apiHelper.post("/Notify/TestMessageByEZPro", data, {
      headers: {
        "Content-Type": "application/json",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  updateReportOnOff(data: any) {
    return apiHelper.put("/Notify/UpdateNotifyOnOff", data, {
      headers: {
        "Content-Type": "application/json",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  editReportSetting(data: any) {
    return apiHelper.put("/Notify/UpdateNotify", data, {
      headers: {
        "Content-Type": "application/json",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  deleteReport(notifyId: string) {
    return apiHelper.delete(`/Notify/DeleteNotify/${notifyId}`, {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  getLookupCode() {
    return apiHelper.get("/System/GetLookupCode", {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  getAboutInfo() {
    return apiHelper.get("/System/About", {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  getLastBackupDate(dateType: string) {
    return apiHelper.get(`/System/GetLastBackupDate?${dateType}`, {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  downloadBackupFile() {
    return apiHelper.get("/System/DownloadBackupFileVIP", {
      headers: { Token: `Bearer ${getCookie("token")}`, accept: "*/*" },
      responseType: "blob", // 指定responseType為'blob'，用於處理二進位數據
    });
  },
  uploadBackupFile(data: FormData) {
    return apiHelper.post("/System/UploadAndRestoreVIP", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  getLicenseStatus() {
    return apiHelper.get(`/System/GetLicenseStatus`, {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  getSentinelStatus() {
    return apiHelper.get(`/System/GetSentinelStatus`, {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
  downloadSentinelFile() {
    return apiHelper.get("/System/DownloadSentinelFile", {
      headers: { Token: `Bearer ${getCookie("token")}`, accept: "*/*" },
      responseType: "blob", // 指定responseType為'blob'，用於處理二進位數據
    });
  },
  downloadSentinelFileErrorMsg() {
    return apiHelper.get("/System/DownloadSentinelFile", {
      headers: { Token: `Bearer ${getCookie("token")}`, accept: "*/*" },
    });
  },
  uploadSentinelFile(data: FormData) {
    return apiHelper.post("/System/UploadSentinelFile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Token: `Bearer ${getCookie("token")}`,
      },
    });
  },
  disabledSentinel() {
    return apiHelper.get("/System/DisabledSentinel", {
      headers: { Token: `Bearer ${getCookie("token")}` },
    });
  },
};
