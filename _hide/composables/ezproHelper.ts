import axios from 'axios'
import { Md5 } from 'ts-md5'

let baseURL = 'https://192.168.1.28:7011'
/**
 * 創建一個名為 ezproHelper 的 Axios 實例
 */
export let ezproHelper = axios.create({
  baseURL
})

/**
 * 產生ezpro授權碼的函式.
 * @param {string} systemId - 該台ezpro主機的cloudId，可由Read System info GET/ rest/v1/system/info這支API查到.
 * @param {string} username - 該台ezpro主機的帳號，也可以用cloud user帳號.
 * @param {string} password - 該台ezpro主機的密碼，也可以用cloud user密碼.
 */
export async function generateKey(url: string, username: string, password: string): Promise<string> {
  try {
    const serverAddress = `http://${url}`

    // const serverAddress = `https://56fb6b49-affd-4bf8-8a1d-044dde1f395b.relay.vmsproxy.com`;
    // const serverAddress = `https://${systemId}.relay.vmsproxy.com`;

    const response = await axios.get(`${serverAddress}/api/getNonce`);
    const data = response.data;
    const realm = data.reply.realm;
    const nonce = data.reply.nonce;
    const digest = new Md5().appendStr(`${username}:${realm}:${password}`).end();
    const partial_ha2 = new Md5().appendStr('GET:').end();
    const simplified_ha2 = new Md5().appendStr(`${digest}:${nonce}:${partial_ha2}`).end();
    const authKey = btoa(`${username}:${nonce}:${simplified_ha2}`);
    return authKey;
  } catch (error) {
    console.error('generateKey:', error);
    return '';
  }
}

/**
 * 產生ezpro http串流網址的函式.
 * @param {string} systemId - 該台ezpro主機的cloudId，可由Read System info GET/ rest/v1/system/info這支API查到.
 * @param {string} cameraId - 該支攝影機的ezpro id
 * @param {string} start - 影像播放的起始時間
 * @param {string} end - 影像播放的結束時間 
 * @param {string} authKey - 可使用ezpro api的授權碼 
 * @param {(cameraURL: string) => void} callback - 使用camera URL的回調函式. 
 */
export function generateVideoUrl(url: string, cameraId: string, start: string, end: string, authKey: string, callback: Function) {
  const serverAddress = `http://${url}`

  // const serverAddress = `https://${systemId}.relay.vmsproxy.com`;
  const cameraURL = `${serverAddress}/media/${cameraId}.webm?pos=${start}&endPos=${end}&auth=${authKey}`
  // const cameraURL = `${serverAddress}/hls/${cameraId}.m3u8?pos=${start}&endPos=${end}&auth=${authKey}`
  callback(cameraURL);
}

/**
 * 產生ezpro 截圖網址的函式.
 * @param {string} systemId - 該台ezpro主機的cloudId，可由Read System info GET/ rest/v1/system/info這支API查到.
 * @param {string} cameraId - 該支攝影機的ezpro id
 * @param {string} time - 影像截圖的時間
 * @param {string} authKey - 可使用ezpro api的授權碼 
 * @param {(screenshotURL: string) => void} callback - 使用screenshot URL的回調函式. 
 */
export function generateScreenshotUrl(systemId: string, cameraId: string, authKey: string, callback: Function, time?: string,) {
  const serverAddress = `https://${systemId}.relay.vmsproxy.com`;
  const screenshotURL = `${serverAddress}/ec2/cameraThumbnail?cameraId=${cameraId}&time=${time}&auth=${authKey}`
  callback(screenshotURL);
}
