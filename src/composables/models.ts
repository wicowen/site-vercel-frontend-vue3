export interface Account {
    userName?: string,
    userId: string,
    userPwd: string,
    userCheckPwd?: string,
}

export interface CurrentUser {
    account: string,
    password: string,
    address: string,
    port: string,
}
export interface User {
    userId: string,
    userName: string,
    groupId: number,
    groupName: string,
}

export interface CameraSchema {
    streamId: string,
    channelName: string,
    ip: string,
    resolution: string,
    videoName?: string,
    videoFile?: File;
    ezproCamId?: string,
    account: string,
    password: string,
    roadName: string,
    coordinates: string,
    personThresh: number,
    carThresh: number,
    motorbikeThresh: number,
    busThresh: number,
    truckThresh: number,
    dropdownStatus?: boolean,
    camStatus?: string,
    isTFAOpen?: boolean,
    isVDOpen?: boolean,
    isLPDROpen?: boolean,
}

export class Camera implements CameraSchema {
    streamId: string;
    channelName: string;
    ip: string;
    resolution: string;
    videoName?: string;
    videoFile?: File;
    ezproCamId?: string;
    account: string;
    password: string;
    roadName: string;
    coordinates: string;
    personThresh: number;
    carThresh: number;
    motorbikeThresh: number;
    busThresh: number;
    truckThresh: number;
    dropdownStatus?: boolean;
    camStatus?: string;
    isTFAOpen?: boolean;
    isVDOpen?: boolean;
    isLPDROpen?: boolean;
    constructor() {
        this.streamId = ''
        this.channelName = ''
        this.ip = ''
        this.resolution = ''
        this.account = ''
        this.password = ''
        this.roadName = ''
        this.coordinates = ''
        this.personThresh = 60
        this.carThresh = 60
        this.motorbikeThresh = 60
        this.busThresh = 60
        this.truckThresh = 60
        this.isTFAOpen = false
        this.isVDOpen = false
        this.isLPDROpen = false
    }
}

export interface GisSetting {
    title?: string
    zoomLevel: string,
    longitude: string,
    latitude: string,
    pitch?: string,
    bearing?: string,
}

export interface RuleBody {
    area: [
        {
            name?: string,
            points: Point[]
        }
    ],
    trafficSignal: Rect,
    timer?: number
}

export interface Rule {
    ruleId?: string,
    streamId?: string,
    eventName: string,
    systemType: string,
    ruleType: string,
    ruleBody: RuleBody
}

export interface RuleUsedCount {
    type: string,
    count: number
}

export interface Point {
    x: number,
    y: number
}

export interface Length {
    width: number,
    height: number,
}

export interface Rect extends Point, Length {
}

export class RoiStyle {
    fillColor: string;
    borderColor: string;
    borderWidth: number;
    constructor() {
        this.fillColor = '#7BD7A14D'
        this.borderColor = '#7BD7A1'
        this.borderWidth = 2
    }
}

export interface RecognizedResult {
    TrackId: string,
    Category: string,
    X1: number,
    Y1: number,
    X2: number,
    Y2: number,
    Confidence: number,
    LicenseNumber: string,
    IsBlocklist: boolean
}
export interface VdRecognizedResultWrapper {
    ObjectInfos: [
        {
            TrackId: string,
        }
    ],
    Id: string,
    FrameId: string,
}
export interface TfaRecognizedResultWrapper {
    ObjectInfos: [],
    Id: string,
    FrameId: string,
    Image: string
}

export interface RecordTFA {
    channelName: string,
    streamId: string,
    ruleId: string,
    eventName: string,
    roadName: string,
    startTime: string,
    endTime: string,
    truck: number,
    bus: number,
    car: number,
    motorbike: number,
    bike: number,
    person: number,
    total: number,
}

export interface RecordLPDR {
    recordId: string,
    time: string,
    channelName: string,
    eventName: string,
    roadName: string,
    licensePlate: string,
    licenseCategoryName: string,
    blocklist: string,
    screenshot: string,
    eventType: string,
    systemType: string,
    vehicleType: string,
    isStreamAlive: string,
    isEventAlive: string
}

export interface RecordVd {
    recordId: string,
    time: string,
    channelName: string,
    eventName: string,
    roadName: string,
    licensePlate: string,
    licenseCategoryName: string,
    blocklist: string,
    screenshot: string,
    eventType: string,
    systemType: string,
    vehicleType: string,
    isStreamAlive: string,
    isEventAlive: string
}

export interface RecordTfaSum {
    totalBike: number,
    totalBus: number,
    totalCar: number,
    totalMotorbike: number,
    totalPerson: number,
    totalSum: number,
    totalTruck: number,
}

export interface Column {
    label: string
    visible: boolean
    name?: string
}

export interface TfaRecordApiBody {
    sTime: string,
    eTime: string,
    period: number,
    pageSize: number,
    pageNumber: number,
    carType: string,
    filterType: string,
    filterValue: string,
    sortRule: SortRule[],
    channelNameFilter: string,
    eventNameFilter: string,
    hideStreamFilter: boolean
}

export interface LpdrRecordApiBody {
    sTime: string,
    eTime: string,
    pageSize: number,
    pageNumber: number,
    filterType: string,
    filterValue: string,
    sortRule: SortRule[],
    channelNameFilter: string,
    eventNameFilter: string,
    hideStreamFilter: boolean,
    licenseCategoryFilter: String
}

export interface VdRecordApiBody {
    sTime: string,
    eTime: string,
    pageSize: number,
    pageNumber: number,
    filterType: string,
    filterValue: string,
    sortRule: SortRule[],
    channelNameFilter: string,
    eventNameFilter: string,
    hideStreamFilter: boolean,
    eventTypeFilter: string
}

export interface SortRule {
    field: string,
    order: number
}

export interface ScreenshotInfo {
    imageData: string,
    boundingBoxX: number,
    boundingBoxY: number,
    boundingBoxX2: number,
    boundingBoxY2: number
}

export interface BlockList {
    licensePlateNumber: string,
    licensePlateId: string,
    licenseCategory: string,
    licenseCategoryName: string
}

export interface ConfigItem {
    Sentinel_signalR_port: string,
    Notify_signalR_port: string,
    Frame_signalR_port: string,
    Tfa_signalR_port: string,
    Vd_signalR_port: string,
    Lpdr_signalR_port: string,
    Monitor_signalR_port: string,
    rtsp_port: string,
    mapKey: string,
    roi_mask_ratio: number
}

export interface ReportSetting {
    notifyId?: string,
    type?: string,
    url: string,
    userName: string,
    password: string,
    verb?: string,
    token?: string,
    notifyTopic: string,
    notifyContent?: string,
    notifyRemark?: string,
    isRun: boolean
}
export interface Notify {
    informId: string,
    isRead: boolean,
    title: string,
    content: string,
    notifyType: number,
    notifyLevel: number,
    createDateTime: string,
    updateDateTime: string
}

export interface FilterDropdown {
    listOfChannelName: string,
    listOfEventName: string,
    listOfEventRule: string,
    listOfLicenseCategory?: string
}
export interface SelectList {
    id: string,
    name?: string,
    selected?: boolean,
    data?: any
}
export class SelectListClass implements SelectList {
    id: string;
    name?: string;
    selected?: boolean;
    data?: any
    constructor() {
        this.id = ''
        this.selected = false
    }
}
export interface ChannelStatus {
    id: string,
    connected: boolean
}
export interface VideoInfo {
    systemId: string,
    url: string,
    username: string,
    password: string,
    cameraId: string,
    start: string,
    end: string,
}
