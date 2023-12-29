<script setup lang="ts">

// import { ref, computed, onBeforeUnmount, watch, onBeforeMount, onMounted } from 'vue'
import { ref, computed, onBeforeUnmount, watch, onBeforeMount } from 'vue'

import { storeToRefs } from 'pinia';
import { useRecordStore } from '@/stores'

import type { RecordLPDR, SortRule, SelectList, Column } from '@/composables/models'
import { SelectListClass } from "@/composables/models";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { getRecordByPageApi, getRecordTotalPageApi, turnOnEventScreenshotModal, resetCurrentPage } = useRecordStore()

const { 
    recordLpdrList, 
    filterDropDownList, 
    selectList, 
    isHideStreamFilter, 
    pageSize, currentPage, 
    // totalPage,
    filterValue, resetTiming, 
    conditionForLpdrApi: conditionForRecordApi, 
    isDataLoaded, isPageNoLoaded, 
    sortDirection, channelNameFilter, 
    eventNameFilter, licenseCategoryShowed 
} = storeToRefs(useRecordStore())

const headerList = ref<SortDirection[]>([
    { name: t('record.Time'), apiLabel: 'Time' }, 
    { name: t('record.Stream_name'), apiLabel: 'ChannelName' }, 
    { name: t('record.Event_name'), apiLabel: 'EventName' }, 
    { name: t('record.Road_name'), apiLabel: 'RoadName' }, 
    { name: t('record.License_plate'), apiLabel: 'LicensePlate' }, 
    { name: t('record.Blocklist'), apiLabel: 'Blocklist' }
])

const headerWithDroplist = ref<string[]>([
    t("record.Stream_name"), 
    t("record.Event_name"), 
    t("record.Blocklist")
])

let sortDirectionList = ref<string[]>(['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'])

let isMounted = ref<boolean>(false)
const isDisableTooltip = ref<boolean>(false)

const tableSelectList = ref<SelectList[]>(
    Array.from(
        { length: pageSize.value }, () => new SelectListClass()
    )
)
let isDropdownFilterUsed = ref<boolean>(false)
let searchChannelInput = ref<string>('')
let searchEventInput = ref<string>('')

const isChannelSelected = ref<SelectList[]>([])
const isEventSelected = ref<SelectList[]>([])
let channelList = ref<string[]>([])
let eventList = ref<string[]>([])

let licenseCategoryList = ref<string[]>([])
let isLicenseCategoryShowed = ref<boolean[]>([true, true, true])

const isTableSelectAll = computed(() => {
    if (!tableSelectList.value) return
    return tableSelectList.value.every(i => i.selected === true)
})

const dropdownChannelList = computed(() => {
    if (searchChannelInput.value.length !== 0) {
        const list: SelectList[] = isChannelSelected.value.filter(i => { return i.name!.toLocaleLowerCase().includes(searchChannelInput.value.trim().toLocaleLowerCase()) })
        return list
    } else {
        return isChannelSelected.value
    }
})

const dropdownEventList = computed(() => {
    if (searchEventInput.value.length !== 0) {
        const list: SelectList[] = isEventSelected.value.filter(i => { return i.name!.toLocaleLowerCase().includes(searchEventInput.value.trim().toLocaleLowerCase()) })
        return list
    } else {
        return isEventSelected.value
    }
})

const blankRowShow = computed(() => {
    let number = 0
    if (recordLpdrList.value && recordLpdrList.value.length < 16) {
        number = 16 - recordLpdrList.value.length
    }
    return number
})

interface SortDirection {
    name: string,
    apiLabel: string
}

const toggleTooltip = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.scrollWidth > target.offsetWidth) {
        isDisableTooltip.value = false
    } else {
        isDisableTooltip.value = true
    }
}

const sortAscending = async (index: number, item: string) => {
    let header = []
    sortDirectionList.value[index] = 'asce'
    header = headerList.value.filter(key => key.apiLabel === item)
    const temp: SortRule = { field: header[0].apiLabel, order: 0 }
    sortDirection.value.push(temp)
    await getRecordByPageApi(currentPage.value)
}

const sortDescending = async (index: number, item: string) => {
    sortDirectionList.value[index] = 'dsce'
    const idx = sortDirection.value.findIndex(i => { return i.field === item })
    sortDirection.value.splice(idx, 1)

    let header = []
    header = headerList.value.filter(key => key.apiLabel === item)
    const temp: SortRule = { field: header[0].apiLabel, order: 1 }
    sortDirection.value.push(temp)
    await getRecordByPageApi(currentPage.value)
}

const ResetSort = async (index: number, item: string) => {
    sortDirectionList.value[index] = 'none'
    const idx = sortDirection.value.findIndex(i => i.field === item)
    sortDirection.value.splice(idx, 1)
    await getRecordByPageApi(currentPage.value)
}

const selectAllData = (_bool: boolean) => {
    let list: RecordLPDR[] = [...recordLpdrList.value]
    if (!_bool) {
        const temp = list.filter(data => { return selectList.value.every(i => i.id !== data.recordId) })
        temp.forEach(data => { selectList.value.push({ id: data.recordId, data: data }) })
        tableSelectList.value = tableSelectList.value.map(i => { return { id: i.id, selected: true } })
    } else {
        selectList.value = selectList.value.filter((item) => !list.some(i => (i.recordId) === (item.id)))
        tableSelectList.value = tableSelectList.value.map(i => { return { id: i.id, selected: false } })
    }
}

const selectData = (_bool: boolean, data: RecordLPDR, id: string) => {
    _bool = !_bool

    if (_bool) {
        selectList.value.push({ id: id, data: data })
    } else {
        selectList.value = selectList.value.filter((item) => item.id !== id)
    }
}

// 生成一维矩阵的函数
const createSelectMatrix = (columns: number): SelectList[] => {
    const newMatrix: SelectList[] = [];
    for (let i = 0; i < columns; i++) {
        const item: SelectList = {
            id: i.toString(),
            selected: false
        }
        newMatrix.push(item)
    }
    return newMatrix;
};

// 初始化table的selectionList
const initialSelectMatrix = (columns: number = recordLpdrList.value.length): SelectList[] => {
    const newMatrix: SelectList[] = [];
    for (let i = 0; i < columns; i++) {
        const item: SelectList = {
            id: recordLpdrList.value[i].recordId
        }
        newMatrix.push(item)
    }
    newMatrix.forEach(item => item.selected = selectList.value.some(i => i.id === item.id))
    return newMatrix;
};

const handleResetAll = () => {
    sortDirectionList.value = ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none']
    searchChannelInput.value = ''
    searchEventInput.value = ''
    eventNameFilter.value = []
    channelNameFilter.value = []
    isChannelSelected.value = createSelectMatrix(channelList.value.length)
    isEventSelected.value = createSelectMatrix(eventList.value.length)
    isChannelSelected.value.forEach((i, index) => i.name = channelList.value[index])
    isEventSelected.value.forEach((i, index) => i.name = eventList.value[index])
    isHideStreamFilter.value = false
    isLicenseCategoryShowed.value = [true, true, true]
    tableSelectList.value = Array.from({ length: pageSize.value }, () => new SelectListClass())
    isDropdownFilterUsed.value = false
}

const selectDropdown = (item: string, type: string, _bool: boolean) => {
    _bool = !_bool
    if (_bool) {
        if (type === t('record.Stream_name')) channelNameFilter.value.push(item)
        if (type === t('record.Event_name')) eventNameFilter.value.push(item)
    } else {
        if (type === t('record.Stream_name')) channelNameFilter.value = channelNameFilter.value.filter((name: string) => !(name === item))
        if (type === t('record.Event_name')) eventNameFilter.value = eventNameFilter.value.filter((name: string) => !(name === item))
    }
}

const selectAllDropdown = (type: string) => {
    if (type === t('record.Stream_name')) {
        channelNameFilter.value = dropdownChannelList.value.map(i => { return i.name as string })
        dropdownChannelList.value.forEach(i => i.selected = true)
    }
    if (type === t('record.Event_name')) {
        eventNameFilter.value = dropdownEventList.value.map(i => { return i.name as string })
        dropdownEventList.value.forEach(i => i.selected = true)
    }
}

const clearDropdown = (type: string) => {
    if (type === t('record.Stream_name')) {
        channelNameFilter.value = channelNameFilter.value.filter(name => { return dropdownChannelList.value.every(i => i.name !== name) })
        dropdownChannelList.value.forEach(i => i.selected = false)
    }
    if (type === t('record.Event_name')) {
        eventNameFilter.value = eventNameFilter.value.filter(name => { return dropdownChannelList.value.every(i => i.name !== name) })
        dropdownEventList.value.forEach(i => i.selected = false)
    }
}

const applyDropdownFilter = async () => {
    resetCurrentPage()
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
    isDropdownFilterUsed.value = true
}

const changeVehicleTypeShowed = async () => {
    licenseCategoryShowed.value.forEach((item: Column, index) => {
        item.visible = isLicenseCategoryShowed.value[index]
    })
    await getRecordByPageApi(currentPage.value)
    await getRecordTotalPageApi()
}




watch(resetTiming, async () => {
    console.log('watch resetTimingresetTiming');
    handleResetAll()
})

watch(conditionForRecordApi, (newValue, oldValue) => {
    console.log('watch conditionForRecordApi', newValue, oldValue);

    let bool = (newValue.sTime !== oldValue.sTime) || (newValue.eTime !== oldValue.eTime) || (newValue.filterType !== oldValue.filterType) || (newValue.filterValue !== oldValue.filterValue) || (newValue.channelNameFilter !== oldValue.channelNameFilter) || (newValue.eventNameFilter !== oldValue.eventNameFilter) || (newValue.hideStreamFilter !== oldValue.hideStreamFilter)
    if (bool && isMounted.value) {
        selectList.value = []
    }
}, { deep: true })

watch(filterDropDownList, (newValue) => {
    console.log('watch filterDropDownList', newValue);

    let bool = newValue.listOfChannelName !== '' && newValue.listOfChannelName !== undefined && newValue.listOfChannelName !== null
    if (bool && isMounted.value) {
        channelList.value = JSON.parse(filterDropDownList.value.listOfChannelName)
        eventList.value = JSON.parse(filterDropDownList.value.listOfEventName)
        licenseCategoryList.value = JSON.parse(filterDropDownList.value.listOfLicenseCategory!)
        isChannelSelected.value = createSelectMatrix(channelList.value.length)
        isEventSelected.value = createSelectMatrix(eventList.value.length)
        isChannelSelected.value.forEach((i, index) => i.name = channelList.value[index])
        isEventSelected.value.forEach((i, index) => i.name = eventList.value[index])
    }
}, { deep: true })

watch(recordLpdrList, () => {
    console.log('watch recordLpdrList', recordLpdrList.value);
    
    if (recordLpdrList.value.length === 0) return 

    tableSelectList.value = initialSelectMatrix()
}, { deep: true })

onBeforeMount(async () => {
    console.log('onBeforeMount');

    isMounted.value = true
})
onBeforeUnmount(() => {
    console.log('onBeforeUnmount');

    selectList.value = []
    eventNameFilter.value = []
    channelNameFilter.value = []
    sortDirection.value = []
})
</script>

<template>

    <div v-if="recordLpdrList.length !== 0 && isDataLoaded && isPageNoLoaded" class="tableWrapper scrollbar">

        <div class="topGapCover"></div>

        <table class="tableContent">

            <thead class="tableHeader">
                <tr>
                    <th class="headerSelector">
                        <label>
                            <span v-if="isTableSelectAll" @click="selectAllData(isTableSelectAll!)"><img alt="img failed"
                                    src="\check_box_table.svg" ></span>
                            <div v-else @click="selectAllData(isTableSelectAll!)"><img alt="img failed" src="\no_check_box_table.svg"
                                    ></div>
                        </label>
                    </th>
                    <th v-for="(label, index) in  headerList " :key="label.name">
                        <div
                            :class="{ dropDownMenu: headerWithDroplist.includes(label.name), nameFilter: headerWithDroplist.includes(label.name) }">
                            <input v-if="headerWithDroplist.includes(label.name)" type="checkbox" :id="label.name">
                            <ul v-if="label.name === t('record.Stream_name') || label.name === t('record.Event_name')"
                                class="nameFilter__menu">
                                <li class="search">
                                    <input v-if="label.name === t('record.Stream_name')" v-model="searchChannelInput"
                                        type="text" class="search__input" size="1" :placeholder="t('record.Search_here')">
                                    <input v-else v-model="searchEventInput" type="text" class="search__input" size="1"
                                        :placeholder="t('record.Search_here')">
                                    <button class="search__icon" type="submit"><img alt="img failed" src="\search.svg"
                                            ></button>
                                </li>
                                <li class="selectAllOrClean">
                                    <span @click="selectAllDropdown(label.name)">{{ $t('record.Select_all') }}</span>
                                    <span @click="clearDropdown(label.name)">{{ $t('record.Clear') }}</span>
                                </li>
                                <div class="nameFilter__menu__wrapper scrollbar">
                                    <template v-if="label.name === t('record.Stream_name')">
                                        <li v-for="data in dropdownChannelList" :key="data.id"
                                            class="nameFilter__menu__item btn">
                                            <label class="nameFilter__menu__item__checkbox">
                                                <input v-model="data.selected" type="checkbox">
                                                <div @click="selectDropdown(data.name!, label.name, data.selected!)"></div>
                                            </label>
                                            <VTooltip :disabled="isDisableTooltip">
                                                <div @mouseover="toggleTooltip" class="nameFilter__menu__item__text">{{
                                                    data.name }}
                                                </div>
                                                <template #popper>
                                                    {{ data.name }}
                                                </template>
                                            </VTooltip>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-for="data in dropdownEventList" :key="data.id"
                                            class="nameFilter__menu__item btn">
                                            <label class="nameFilter__menu__item__checkbox">
                                                <input v-model="data.selected" type="checkbox">
                                                <div @click="selectDropdown(data.name!, label.name, data.selected!)"></div>
                                            </label>
                                            <VTooltip :disabled="isDisableTooltip">
                                                <div @mouseover="toggleTooltip" class="nameFilter__menu__item__text">{{
                                                    data.name }}
                                                </div>
                                                <template #popper>
                                                    {{ data.name }}
                                                </template>
                                            </VTooltip>
                                        </li>
                                    </template>

                                </div>

                                <div class="nameFilter__menu__apply">
                                    <button @click="applyDropdownFilter" class="btn">{{ $t('record.Apply') }}</button>
                                </div>
                            </ul>
                            <ul v-if="label.name === t('record.Blocklist')" class="nameFilter__menu licenseCategory">
                                <li v-for="(value, key) in licenseCategoryList" :key="key"
                                    :class="{ 'checked': isLicenseCategoryShowed[key] }" class="nameFilter__menu__item btn">
                                    <label class="nameFilter__menu__item__checkbox">
                                        <input v-model="isLicenseCategoryShowed[key]" type="checkbox">
                                        <div></div>
                                    </label>
                                    <div class="nameFilter__menu__item__text">{{ value }}</div>
                                </li>
                                <div class="nameFilter__menu__apply">
                                    <button @click="changeVehicleTypeShowed" class="btn">{{ $t('record.Apply') }}</button>
                                </div>
                            </ul>
                            <label v-if="headerWithDroplist.includes(label.name)" :for="label.name"
                                class="list__head__title__sort"><img alt="img failed" src="\arrow_drop_down.svg" ></label>
                            <button v-else-if="sortDirectionList[index] === 'none'"
                                @click="sortAscending(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\nonSort.svg" ></button>
                            <button v-else-if="sortDirectionList[index] === 'asce'"
                                @click="sortDescending(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\asceSort.svg" ></button>
                            <button v-else-if="sortDirectionList[index] === 'dsce'"
                                @click="ResetSort(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\dsceSort.svg" ></button>
                            <VTooltip :disabled="isDisableTooltip">
                                <span @mouseover="toggleTooltip">{{ label.name }}</span>
                                <template #popper>
                                    {{ label.name }}
                                </template>
                            </VTooltip>
                        </div>
                    </th>
                    <th>
                        <div>
                            <VTooltip :disabled="isDisableTooltip">
                                <span @mouseover="toggleTooltip">{{ $t('record.Screenshot') }}</span>
                                <template #popper>
                                    {{ $t('record.Screenshot') }}
                                </template>
                            </VTooltip>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody class="tableBody">
                <tr v-for="( data, index ) in  recordLpdrList " :key="data.recordId">
                    <th class="selector">
                        <label>
                            <input v-model="tableSelectList[index].selected" type="checkbox">
                            <span
                                @click="selectData(tableSelectList[index].selected!, data, tableSelectList[index].id)"></span>
                        </label>
                    </th>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.time }}</div>
                            <template #popper>
                                {{ data.time }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.channelName }}</div>
                            <template #popper>
                                {{ data.channelName }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.eventName }}</div>
                            <template #popper>
                                {{ data.eventName }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.roadName }}</div>
                            <template #popper>
                                {{ data.roadName }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.licensePlate }}</div>
                            <template #popper>
                                {{ data.licensePlate }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <VTooltip :disabled="isDisableTooltip">
                            <div @mouseover="toggleTooltip">{{ data.licenseCategoryName }}</div>
                            <template #popper>
                                {{ data.licenseCategoryName }}
                            </template>
                        </VTooltip>
                    </td>
                    <td>
                        <img alt="img failed" class="tableBody__screenImg"
                            @click="turnOnEventScreenshotModal(data.recordId, data.licenseCategoryName, data.licensePlate)"
                            src="\photo_table.svg">
                    </td>
                </tr>
                    <tr v-for="(item, index) in blankRowShow" :key="index" class="blank">
                    </tr>
                </tbody>

        </table>

        <div class="bottomGapCover"></div>

    </div>

    <div v-else-if="recordLpdrList.length === 0 && isDropdownFilterUsed && isDataLoaded && isPageNoLoaded">
        <table class="tableContent">
            <thead class="tableHeader">
                <tr>
                    <th class="headerSelector">
                        <label>
                            <span v-if="isTableSelectAll" @click="selectAllData(isTableSelectAll!)"><img alt="img failed"
                                    src="\check_box_table.svg" ></span>
                            <div v-else @click="selectAllData(isTableSelectAll!)"><img alt="img failed" src="\no_check_box_table.svg"
                                    ></div>
                        </label>
                    </th>
                    <th v-for="(label, index) in  headerList " :key="label.name">
                        <div
                            :class="{ dropDownMenu: headerWithDroplist.includes(label.name), nameFilter: headerWithDroplist.includes(label.name) }">
                            <input v-if="headerWithDroplist.includes(label.name)" type="checkbox" :id="label.name">
                            <ul v-if="label.name === t('record.Stream_name') || label.name === t('record.Event_name')"
                                class="nameFilter__menu">
                                <li class="search">
                                    <input v-if="label.name === t('record.Stream_name')" v-model="searchChannelInput"
                                        type="text" class="search__input" size="1" :placeholder="t('record.Search_here')">
                                    <input v-else v-model="searchEventInput" type="text" class="search__input" size="1"
                                        :placeholder="t('record.Search_here')">
                                    <button class="search__icon" type="submit"><img alt="img failed" src="\search.svg"
                                            ></button>
                                </li>
                                <li class="selectAllOrClean">
                                    <span @click="selectAllDropdown(label.name)">{{ $t('record.Select_all') }}</span>
                                    <span @click="clearDropdown(label.name)">{{ $t('record.Clear') }}</span>
                                </li>
                                <div class="nameFilter__menu__wrapper scrollbar">
                                    <template v-if="label.name === t('record.Stream_name')">
                                        <li v-for="data in dropdownChannelList" :key="data.id"
                                            class="nameFilter__menu__item btn">
                                            <label class="nameFilter__menu__item__checkbox">
                                                <input v-model="data.selected" type="checkbox">
                                                <div @click="selectDropdown(data.name!, label.name, data.selected!)"></div>
                                            </label>
                                            <VTooltip :disabled="isDisableTooltip">
                                                <div @mouseover="toggleTooltip" class="nameFilter__menu__item__text">{{
                                                    data.name }}
                                                </div>
                                                <template #popper>
                                                    {{ data.name }}
                                                </template>
                                            </VTooltip>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-for="data in dropdownEventList" :key="data.id"
                                            class="nameFilter__menu__item btn">
                                            <label class="nameFilter__menu__item__checkbox">
                                                <input v-model="data.selected" type="checkbox">
                                                <div @click="selectDropdown(data.name!, label.name, data.selected!)"></div>
                                            </label>
                                            <VTooltip :disabled="isDisableTooltip">
                                                <div @mouseover="toggleTooltip" class="nameFilter__menu__item__text">{{
                                                    data.name }}
                                                </div>
                                                <template #popper>
                                                    {{ data.name }}
                                                </template>
                                            </VTooltip>
                                        </li>
                                    </template>

                                </div>

                                <div class="nameFilter__menu__apply">
                                    <button @click="applyDropdownFilter" class="btn">{{ $t('record.Apply') }}</button>
                                </div>
                            </ul>
                            <ul v-if="label.name === t('record.Blocklist')" class="nameFilter__menu licenseCategory">
                                <li v-for="(value, key) in licenseCategoryList" :key="key"
                                    :class="{ 'checked': isLicenseCategoryShowed[key] }" class="nameFilter__menu__item btn">
                                    <label class="nameFilter__menu__item__checkbox">
                                        <input v-model="isLicenseCategoryShowed[key]" type="checkbox">
                                        <div></div>
                                    </label>
                                    <div class="nameFilter__menu__item__text">{{ value }}</div>
                                </li>
                                <div class="nameFilter__menu__apply">
                                    <button @click="changeVehicleTypeShowed" class="btn">{{ $t('record.Apply') }}</button>
                                </div>
                            </ul>
                            <label v-if="headerWithDroplist.includes(label.name)" :for="label.name"
                                class="list__head__title__sort"><img alt="img failed" src="\arrow_drop_down.svg" ></label>
                            <button v-else-if="sortDirectionList[index] === 'none'"
                                @click="sortAscending(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\nonSort.svg" ></button>
                            <button v-else-if="sortDirectionList[index] === 'asce'"
                                @click="sortDescending(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\asceSort.svg" ></button>
                            <button v-else-if="sortDirectionList[index] === 'dsce'"
                                @click="ResetSort(index, label.apiLabel)" class="list__head__title__sort"><img alt="img failed"
                                    src="\dsceSort.svg" ></button>
                            <VTooltip :disabled="isDisableTooltip">
                                <span @mouseover="toggleTooltip">{{ label.name }}</span>
                                <template #popper>
                                    {{ label.name }}
                                </template>
                            </VTooltip>
                        </div>
                    </th>
                    <th>
                        <div>
                            <VTooltip :disabled="isDisableTooltip">
                                <span @mouseover="toggleTooltip">{{ $t('record.Screenshot') }}</span>
                                <template #popper>
                                    {{ $t('record.Screenshot') }}
                                </template>
                            </VTooltip>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody class="tableBody noFilterResult" style="position: relative">
                <div>
                    <img alt="img failed" src="\img_no_search_result.png"  class="noFilterResult__img">
                    <span class="noFilterResult__text">{{ $t('record.No_matching_record_Please_search_again') }}</span>
                </div>
                <tr v-for="(i, index) in (blankRowShow + 1)" :key="index" class="blank">
                </tr>
            </tbody>
        </table>
    </div>

    <div v-else-if="recordLpdrList.length === 0 && filterValue && isDataLoaded && isPageNoLoaded"
        class="tableWrapper noResult">
        <img alt="img failed" src="\img_no_search_result.png"  class="noSearchResult__img">
        <span class="noSearchResult__text">{{ $t('record.No_matching_record_Please_search_again') }}</span>
    </div>

    <div v-else-if="recordLpdrList.length === 0 && isDataLoaded && isPageNoLoaded" class="tableWrapper noResult">
        <img alt="img failed" src="\img_record_EmptyState.png"  class="noSearchResult__img">
        <span class="noSearchResult__text">{{ $t('record.You_dont_have_any_record_yet') }}</span>
    </div>

    <div v-else-if="!isDataLoaded || !isPageNoLoaded" class="tableWrapper table-loader">
        <!-- <img alt="img failed" src="\loader.gif"> -->
    </div>

</template>

<style lang="scss" scoped>
@media (max-width: 853px) {
    .tableWrapper {
        overflow-x: auto !important;
    }

    .tableContent {
        width: auto !important;
    }
}

.tableWrapper {
    height: 72vh;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    &.table-loader {
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
            width: 3.75rem;
            height: 3.75rem;
        }
    }

    & .topGapCover {
        background: #444A54;
        height: 5px;
        width: 83vw;
        position: absolute;
        top: 5vh;
        border-bottom: 1px solid rgba(33, 39, 44, 0.5);
    }

    & .bottomGapCover {
        background: #444A54;
        height: 5px;
        width: 83vw;
        position: absolute;
        bottom: 5.4vh;
        border-top: 1px solid rgba(33, 39, 44, 0.5);
    }

    &.noResult {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #3B414A;

        & span {
            color: #FFFFFF4D;
            font-size: 0.875rem;
        }
    }
}

.tableContent {
    background: #3B414A;
    height: 100%;
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    & tr,
    & th,
    & td {
        vertical-align: middle;
        text-align: start;
        height: 3.9vh;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: default;
    }

    & th,
    & td {
        padding: 0 0.5rem;
        width: 10vw;
    }

}

thead {
    background-color: #444A54;
    position: sticky;
    top: 0;
    // z-index: 10;

    & div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        white-space: nowrap;
        // width: calc(7.2vw - 1.125rem);
        width: 100%;
    }

    & span {
        display: inline-block;
        width: 8vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    // & button {
    //     width: 1.5vw;
    // }

    & label.list__head__title__sort:hover {
        background: #3A9376;
        border-radius: 100px;
        background: var(--liveview-button-default, rgba(0, 0, 0, 0.20));
    }
}

tbody {
    background-color: #3B414A;

    & div {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    & .blank {
        border: none;
    }

    & tr {
        border: 1px solid rgba(33, 39, 44, 0.5);
    }

    & tr:hover {
        background: #444A54;
    }

    & tr:active {
        background: #266B5E;
    }

    &.noFilterResult {
        position: relative;

        & div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        & span {
            color: #FFFFFF4D;
            font-size: 0.875rem;
        }

        & img {
            width: 10.875rem;
        }
    }
}

tfoot {
    position: sticky;
    bottom: 0;
    // z-index: 10;
    background-color: #3B414A;

    & div {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

th.selector {
    width: 3.9vh;
    text-align: center;
    vertical-align: middle;
    padding-left: 0.5625rem;

    & span {
        display: inline-block;
        vertical-align: middle;
        width: 1.5rem;
        height: 1.5rem;
        background: url(/no_check_box_table.svg) no-repeat;
        user-select: none;
        cursor: pointer;

        &:hover {
            background: url(/no_check_box_table_hover.svg) no-repeat;
        }
    }

    & input[type=checkbox] {
        display: none;
    }

    & input[type=checkbox]:checked+span {
        background: url(/check_box_table.svg) no-repeat;

        &:hover {
            background: url(/check_box_table_hover.svg) no-repeat;
        }
    }
}

th.headerSelector {
    width: 3.9vh;
    text-align: center;
    vertical-align: middle;
    padding-left: 0.5625rem;

    & span,
    & div {
        display: inline-block;
        vertical-align: middle;
        width: 1.5rem;
        height: 1.5rem;
        user-select: none;
        cursor: pointer;
    }

    & span:hover {
        background: url(/check_box_table_hover.svg) no-repeat;
    }

    & div:hover {
        background: url(/no_check_box_table.svg) no-repeat;
    }
}

.tableBody {
    &__screenImg {
        cursor: pointer;
    }
}

.dropDownMenu {
    position: relative;

    & input {
        display: none;

        &:checked~label {
            border-radius: 100px;
            background: var(--liveview-button-default, rgba(0, 0, 0, 0.20));
        }
    }

    & label {
        display: flex;
        align-items: center;
        height: 1.375rem;
        cursor: pointer;
    }

    & ul {
        position: absolute;
        z-index: 80;
        display: flex;
        flex-direction: column;
        left: -0.5rem;
        top: calc(1.95vh + 0.6875rem + 1px);
        width: 18.9375rem;
        padding: 0.5rem 0;
        border-radius: 4px;
        transform-origin: top;
        transform: scale(1, 0);
        opacity: 0;
        transition: transform 0.3s ease-out;
        background: #444A54;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

        & li {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
            background: #444A54;
            width: 100%;
            height: 3.9vh;
            white-space: nowrap;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            color: #FFFFFF;
        }
    }

    & input[type=checkbox]:checked~ul {
        opacity: 1;
        transform: scale(1, 1);
        transition: transform 0.8s ease-in-out;
        transition: opacity 0.1s ease-in-out;
    }

    & .btn:hover {
        background: #656C74;
    }

    & .btn:active {
        background: #3A9376;
    }
}

.nameFilter {
    margin-right: 0.25rem;

    &__menu {
        &__toggle {
            transform: scale(1, 1);
            transition: transform 0.8s ease-in-out;
            transition: opacity 0.1s ease-in-out;
            opacity: 1;
        }

        &__wrapper {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            // height: 15rem;
            max-height: 15rem;
        }

        &__item {
            cursor: default;

            &__checkbox {

                & div {
                    margin: 0 0.6875rem 0 0;
                    width: 1.375rem;
                    height: 1.375rem;
                    background: url(/no_check_box_table.svg) no-repeat;
                    user-select: none;

                    &:hover {
                        background: url(/no_check_box_table_hover.svg) no-repeat;
                    }
                }

                & input[type=checkbox] {
                    display: none;
                }

                & input[type=checkbox]:checked+div {
                    background: url(/check_box_table.svg) no-repeat;

                    &:hover {
                        background: url(/check_box_table_hover.svg) no-repeat;
                    }
                }
            }

            &__text {
                display: inline-block;
                width: 15.5rem;
                font-size: 0.875rem;
                color: #FFFFFF;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        &__apply {
            display: flex;
            align-items: center;
            height: 6.25vh;
            padding: 0.5rem 0 0 1rem;
            cursor: default;

            & button {
                width: 5rem;
                height: 3.9vh;
                border: 1px solid #7C8589;
                border-radius: 4px;
                color: #FFFFFF;
            }
        }
    }
}

ul.licenseCategory {
    width: 10vw;
}

.search {
    &__icon {
        flex-basis: 0.75rem;
    }

    & button {
        padding: 0;
    }

    & input {
        display: inline-block;
    }

    &__input {
        flex-grow: 1;
        font-size: 0.875rem;
        padding-right: 0.75rem;
        background: #444A54;
        color: #FFFFFF;
        border: none;

        &::placeholder {
            font-weight: 500;
            font-size: .875rem;
            color: #FFFFFF;
            opacity: 0.36;
        }
    }

    &__icon {
        position: relative;
    }
}

li.selectAllOrClean {
    justify-content: space-between;

    & span {
        width: fit-content;
        color: #94E4B0;
        cursor: pointer;
    }
}

.scrollbar {

    &::-webkit-scrollbar {
        width: 6px;
    }

    // bar的樣式
    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        // background-color: rgba(117, 117, 117);
        background-color: rgba(255, 253, 253, 0.353);
    }

    &::-webkit-scrollbar-track {
        background-color: rgb(79, 79, 79);
    }
}
</style>
