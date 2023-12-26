import { Base64 } from 'js-base64';

const cookieList = ['connect', 'connectPort', 'account', 'password', 'address', 'port', 'ezproId']

export const setCookie = (name: string, value: any, expDays: number) => {
    let exDate = new Date()
    exDate.setDate(exDate.getDate() + expDays)
    window.document.cookie = name + "=" + Base64.encode(value) + ";path=/;expires=" + exDate
    // window.document.cookie = name + "=" + Base64.encode(value) + ";path=/;expires=" + exDate + ";SameSite=Strict"
}

export const getCookie = (_key: string): string => {
    const list = new Map()
    if (document.cookie.length > 0) {
        let arr: string[] = document.cookie.split('; ')
        arr.forEach((item, i: number) => {
            let temp: string[] = item.split('=')
            let isCookie = temp.some(i => { return i === temp[0] })
            let cookie = isCookie ? Base64.decode(temp[1]) : temp[1]
            list.set(temp[0], cookie)
        })
    }
    return list.get(_key) as string
}