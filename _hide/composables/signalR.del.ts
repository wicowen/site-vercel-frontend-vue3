import * as signalR from '@microsoft/signalr'


const url = "http://192.168.1.189:5002/hubs/tfa"
const signal = new signalR.HubConnectionBuilder()
    .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect() // 設定用戶端等候 0、2、10 和 30 秒，然後再嘗試每次重新連線嘗試。 嘗試四次失敗之後，它會停止嘗試重新連線
    .configureLogging(signalR.LogLevel.Information)
    .build()

export default {
    signal
}