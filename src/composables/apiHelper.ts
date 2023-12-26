import axios from "axios";
import { getCookie, setCookie } from "@/composables/cookie";
import { swalErrorModal } from "@/composables/swalModal";
import i18n from "@/plugins/i18n";
import router from "@/router";

let address: string = getCookie("connect");
let port: string = getCookie("connectPort");
let baseURL = "http://" + address + ":" + port + "/api";

export const getIp = (ip: string, _port: string) => {
  address = ip;
  port = _port;
  baseURL = "http://" + address + ":" + port + "/api";
  // apiHelper = axios.create({
  //   baseURL,
  // });
  // refreshApiHelper()
  apiHelper.defaults.baseURL = baseURL
  setCookie('connect', ip, 10)
  setCookie('connectPort', _port, 10)
  return baseURL;
};

export let apiHelper = axios.create({
  baseURL,
  timeout: 30000,
});

let refreshApiHelper = () => {  

  //請求攔截器
  apiHelper.interceptors.request.use(
    (request) => {
      // 如果沒有token直接push到login頁面
      if(!getCookie("token")){
          router.push('/Login')
      }
      if(!localStorage.getItem('language')){
        localStorage.setItem('language', navigator.language.slice(0, 2))
      }
      request.headers['Accept-Language'] = localStorage.getItem('language')
      // 必須返回 request
      return request
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  apiHelper.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        return response;
      } else {
        if (response.status === 204) {
          swalErrorModal.fire(i18n.global.t("swalErrorModal.204_error"));
          return response;
        }
        swalErrorModal.fire(response.statusText);
        return Promise.reject(new Error(response.statusText));
      }
    },
    (error) => {
      if (error.code == "ECONNABORTED") {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.ECONNABORTED"));
        return Promise.reject(error);
      }
      if (error.code === "ERR_NETWORK") {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.ERR_NETWORK"));
        return Promise.reject(error);
      }
      if (error.response.status === 400) {
        const msg: string = error.response.data.errorMessage
        if (msg === 'Authorization is 100% full. Please confirm.') {
          swalErrorModal.fire(i18n.global.t("swalErrorModal.Authorization_is_full"))
          return
        } else {
          swalErrorModal.fire(i18n.global.t("swalErrorModal.400_error"));
          return Promise.reject(error);
        }
      }
      if (error.response.status === 401) {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.401_error"));
        return Promise.reject(error);
      }
      if (error.response.status === 403) {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.403_error"));
        return Promise.reject(error);
      }
      if (error.response.status === 404) {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.404_error"));
        return Promise.reject(error);
      }
      if (error.response.status === 500) {
        swalErrorModal.fire(i18n.global.t("swalErrorModal.500_error"));
        return Promise.reject(error);
      }
      swalErrorModal.fire(error.message);
      return Promise.reject(error);
    }
  );

}

refreshApiHelper()


