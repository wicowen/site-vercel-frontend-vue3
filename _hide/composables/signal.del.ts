import * as signalR from '@microsoft/signalr'
import { getCookie } from "@/composables/cookie";

let address: string = getCookie("connect");

let urlFrame = `http://${address}:5002/hubs/frame`
let urlTfa = `http://${address}:5002/hubs/tfa`
let urlVd = `http://${address}:5002/hubs/vd`
let urlLpdr = `http://${address}:5002/hubs/lpdr`
let urlNoti = `http://${address}:7033/hubs/informHub`
let urlSenti = `http://${address}:7033/hubs/sentinelHub`

export const signalFrame = new signalR.HubConnectionBuilder()
    .withUrl(urlFrame, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()

export const signalTfa = new signalR.HubConnectionBuilder()
    .withUrl(urlTfa, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()

export const signalVd = new signalR.HubConnectionBuilder()
    .withUrl(urlVd, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()

export const signalLpdr = new signalR.HubConnectionBuilder()
    .withUrl(urlLpdr, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()

export const signalNotify = new signalR.HubConnectionBuilder()
    .withUrl(urlNoti, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()

export const signalSentinel = new signalR.HubConnectionBuilder()
    .withUrl(urlSenti, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Error)
    .build()