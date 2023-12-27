<script lang="ts" setup>

import { ref, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from 'pinia'
import { useRecordStore } from '@/stores'
import { utils, writeFile } from 'xlsx'
import router from '@/router';
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { 
    filterType, 
    filterValue, 
    allDataList, 
    selectList, 
    resetTiming, 
    isHideStreamFilter, 
    totalItem 
} = storeToRefs(useRecordStore())


const { 
    getRecordByPageApi, 
    getRecordTotalPageApi, 
    getDropdownListApi, 
    getTfaRecord, 
    getLpdrRecord, 
    getVdRecord, 
    resetCurrentPage, 
    resetAll, 
    changeRecordType 
} = useRecordStore()


const route = useRoute()

let isAdvancedSearchMenuOpen = ref<boolean>(false)
let searchInput = ref<string>('')
let isCategoryMenuOpen = ref<boolean>(false)
let isExportMenuOpen = ref<boolean>(false)
let checkStNameSearched = ref<boolean>(true)
let checkEtNameSearched = ref<boolean>(true)
let checkRdNameSearched = ref<boolean>(true)
let checkLpSearched = ref<boolean>(true)
let isCheckedRecordMenuOpen = ref<boolean>(false)
let isCurrentPageMenuOpen = ref<boolean>(false)
let menuRef = ref<HTMLElement | null>()
let sideMenuRef = ref<HTMLElement | null>()
let categoryMenuRef = ref<HTMLElement | null>()
let exportMenuRef = ref<HTMLElement | null>()
let isSideMenuExtendLeft = ref(true)
let category = ref<string>(t('record.Traffic_Flow'))

// 監聽 stores 裡面 language 的變化如有改變及時更改category的值，此方法是為了解決 category 無法及時刷新問題
// watch(language,()=>{
//     if (route.name === 'tableTFA') category.value = t('record.Traffic_Flow')
//     if (route.name === 'tableVD') category.value = t('record.Violation')
//     if (route.name === 'tableLPDR') category.value = t('record.License_Plate_Recognition')
// })

// 點擊graph.svg並切換路由到 /Graph
const gotoGraphPage = () => {
    router.push('/Graph')
}
// 點擊list.svg並切換路由到 /Record
const gotoRecordList = () => {
    router.push('/Record')
}
//下拉視窗開啟時，點擊其他處能自動收闔
const autoClosedDropdown = (e: Event) => {
    if (!e) return
    if (isExportMenuOpen && !exportMenuRef.value?.contains(e.target as Node)) {
        isExportMenuOpen.value = false
    }
    if (isCategoryMenuOpen && !categoryMenuRef.value?.contains(e.target as Node)) {
        isCategoryMenuOpen.value = false
    }
}
const applySearchType = () => {
    let list = []
    if (checkStNameSearched.value) list.push('ChannelName')
    if (checkEtNameSearched.value) list.push('EventName')
    if (checkRdNameSearched.value) list.push('RoadName')
    if (checkLpSearched.value) list.push('LicensePlateNumber')
    filterType.value = list.join(',')
    isAdvancedSearchMenuOpen.value = false
}
const searchChannel = async (item: string) => {
    if (!item.trim()) return
    filterValue.value = searchInput.value.trim()
    resetCurrentPage()
    applySearchType()
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
}
const cleanSearchInput = async () => {
    resetCurrentPage()
    filterValue.value = searchInput.value = ''
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
}
const handleResetAll = () => {
    filterValue.value = searchInput.value = ''
    checkStNameSearched.value = checkEtNameSearched.value = checkRdNameSearched.value = checkLpSearched.value = true
    applySearchType()
}
const openDropdown = (item: string) => {
    //判斷side menu要向左還是向右延伸，若右邊空間足夠才向右，否則預設向左
    const sideMenuWidth = sideMenuRef.value!.getBoundingClientRect().width + 4
    const menuRight = menuRef.value!.getBoundingClientRect().right
    const space = window.innerWidth - menuRight
    isSideMenuExtendLeft.value = space < sideMenuWidth

    if (selectList.value.length === 0 && item === 'checked records') return
    if (item === 'checked records') isCheckedRecordMenuOpen.value = true
    if (item === 'all data') isCurrentPageMenuOpen.value = true
}
const closeDropdown = (item: string) => {
    if (selectList.value.length === 0 && item === 'checked records') return
    if (item === 'checked records') isCheckedRecordMenuOpen.value = false
    if (item === 'all data') isCurrentPageMenuOpen.value = false
}
const saveFile = async (item: string, type: string) => {
    if (item === 'all data') {
        switch (route.name) {
            case 'tableTFA':
                await getTfaRecord()
                break
            case 'tableLPDR':
                await getLpdrRecord()
                break
            case 'tableVD':
                await getVdRecord()
                break
        }
    }
    const tempList: any[] = []
    selectList.value.forEach(i => tempList.push(i.data))
    const fileType: string = type === 'csv' ? 'csv' : 'xls'
    const list = item === 'all data' ? allDataList.value : Array.from(new Set(tempList))
    let filteredFields: string[] = []
    let newHeader: string[] = []; // 新的表頭

    switch (route.name) {
        case 'tableTFA':
            filteredFields = ['startTime', 'endTime', 'channelName', 'eventName', 'roadName', 'truck', 'bus', 'car', 'motorbike', 'bike', 'person', 'total'];
            newHeader = [t("record.start_time"), t("record.end_time"), t("record.Stream_name"), t("record.Event_name"), t("record.Road_name"), t("record.Truck"), t("record.Bus"), t("record.Car"), t("record.Motorbike"), t("record.Bike"), t("record.Person"), t("record.Total")];
            break;
        case 'tableLPDR':
            filteredFields = ['time', 'channelName', 'eventName', 'roadName', 'vehicleType', 'licenseCategoryName', 'licensePlate'];
            newHeader = [t("record.Time"), t("record.Stream_name"), t("record.Event_name"), t("record.Road_name"), t("record.License_plate"), t("record.Blocklist"), t("record.Screenshot")];
            break;
        case 'tableVD':
            filteredFields = ['time', 'channelName', 'vehicleType', 'eventName', 'eventType', 'roadName', 'licensePlate'];
            newHeader = [t("record.Time"), t("record.Stream_name"), t("record.Vehicle_type"), t("record.Event_name"), t("record.Event_type"), t("record.Road_name"), t("record.License_plate")];
            break;
    }

    // 建立新的資料陣列，只保留需要的欄位
    const filteredList = list.map((item: any) => {
        const filteredItem: { [key: string]: string } = {};
        filteredFields.forEach((field, index) => {
            const newFieldName = newHeader[index] || field; // 如果有新的表頭，使用新的表頭，否則使用舊的
            filteredItem[newFieldName] = item[field as keyof typeof item] as string;
        });
        return filteredItem;
    });

    const data = utils.json_to_sheet(filteredList)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, data, `${new Date().toISOString().replace(/:/g, '-')}`)
    writeFile(wb, `${new Date().toISOString().replace(/:/g, '-')}.${fileType}`)
}
const changeTable = async (routeName: string) => {
    changeRecordType(routeName)
    if (routeName === 'tableTFA') category.value = t('record.Traffic_Flow')
    if (routeName === 'tableVD') category.value = t('record.Violation')
    if (routeName === 'tableLPDR') category.value = t('record.License_Plate_Recognition')
    router.push({ name: routeName })
    isHideStreamFilter.value = false
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
    await getDropdownListApi()
}
watch(resetTiming, async () => {
    await handleResetAll()
})
onMounted(() => {
    if (route.name === 'tableTFA') category.value = t('record.Traffic_Flow')
    if (route.name === 'tableVD') category.value = t('record.Violation')
    if (route.name === 'tableLPDR') category.value = t('record.License_Plate_Recognition')
    document.addEventListener('click', autoClosedDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', autoClosedDropdown);
    handleResetAll()
});
</script>

<template>
    <!-- 這是Record的ToolBar -->
    <div class="toolbar" v-show="$route.name != 'graph'">
        <div class="toolbar__left">
            <VTooltip>
                <button @click="resetAll" class="soloButton btn"><img alt="img failed" src="\refresh.svg"></button>
                <template #popper>
                    {{ $t('record.Reset') }}
                </template>
            </VTooltip>
            <div class="category dropDownMenu btn">
                <input v-model="isCategoryMenuOpen" type="checkbox" id="tableCategory">
                <ul class="category__menu">
                    <li @click="changeTable('tableTFA')" class="category__menu__item"> {{ $t('record.Traffic_Flow') }}</li>
                    <li @click="changeTable('tableLPDR')" class="category__menu__item">
                        {{ $t('record.License_Plate_Recognition') }}</li>
                    <li @click="changeTable('tableVD')" class="category__menu__item">{{ $t('record.Violation') }}</li>
                </ul>
                <label ref="categoryMenuRef" for="tableCategory" class="category__label">
                    {{ category }}
                    <img alt="img failed" src="\arrow_down.svg">
                </label>
            </div>
            <div class="search">
                <button @click="isAdvancedSearchMenuOpen = !isAdvancedSearchMenuOpen" class="search__filter"
                    type="submit"><img alt="img failed" src="\filter_alt.svg"></button>
                <input @keyup.enter="searchChannel(searchInput)" v-model="searchInput" type="text" class="search__input"
                    size="1" :placeholder="$t('record.Search_here')">
                <button v-if="searchInput.split('').length === 0" @click="cleanSearchInput" class="search__canceled normalcancel"
                    type="submit"><img alt="img failed" src="\close.svg"></button>
                <button v-else @click="cleanSearchInput" class="search__canceled" type="submit"><img alt="img failed"
                        src="\close.svg"></button>
                <button @click="searchChannel(searchInput)" class="search__icon" type="submit"><img alt="img failed"
                        src="\search.svg"></button>
                <ul class="search__filter__menu" :class="{ 'search__filter__menu__toggle': isAdvancedSearchMenuOpen }">
                    <li :class="{ 'checked': checkStNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkStNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">{{ $t('record.Stream_name') }}</div>
                    </li>
                    <li :class="{ 'checked': checkEtNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkEtNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">{{ $t('record.Event_name') }}</div>
                    </li>
                    <li :class="{ 'checked': checkRdNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkRdNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">{{ $t('record.Road_name') }}</div>
                    </li>
                    <li v-show="category !== t('record.Traffic_Flow')" :class="{ 'checked': checkLpSearched }"
                        class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkLpSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">{{ $t('record.License_plate') }}</div>
                    </li>
                    <div class="search__filter__menu__apply">
                        <button @click="applySearchType" class="btn">{{ $t('record.Apply') }}</button>
                    </div>
                </ul>
            </div>
        </div>
        <div class="toolbar__right">
            <!-- <div @click="gotoGraphPage" class="soloButton btn" v-show="$route.name === 'tableTFA'">
                    <img alt="img failed" src="\graph.svg">
                </div> -->
            <div class="export dropDownMenu btn">
                <input v-model="isExportMenuOpen" type="checkbox" id="exportRecord">
                <ul class="export__menu" ref="menuRef">
                    <li :class="{ disabled: selectList.length === 0 }" @mouseenter="openDropdown('checked records')"
                        @mouseleave="closeDropdown('checked records')" class="export__menu__item dropDownMenu">
                        <input v-model="isCheckedRecordMenuOpen" type="checkbox" id="exportCheckedRecord">
                        <ul class="export__sideMenu" :class="{ right: !isSideMenuExtendLeft, left: isSideMenuExtendLeft }">
                            <li @click="saveFile('checked records', 'csv')" class="export__sideMenu__item">
                                {{ $t('record.export_csv') }}
                            </li>
                            <li @click="saveFile('checked records', 'xls')" class="export__sideMenu__item">
                                {{ $t('record.export_xls') }}
                            </li>
                        </ul>
                        <label for="exportCheckedRecord">
                            {{ $t('record.Checked_records') }} <img alt="img failed" src="\arrow_right.svg">
                        </label>
                    </li>
                    <li :class="{ disabled: totalItem === 0 }" @mouseenter="openDropdown('all data')"
                        @mouseleave="closeDropdown('all data')" class="export__menu__item dropDownMenu">
                        <input v-model="isCurrentPageMenuOpen" type="checkbox" id="exportCurrentPage">
                        <ul class="export__sideMenu" ref="sideMenuRef"
                            :class="{ right: !isSideMenuExtendLeft, left: isSideMenuExtendLeft }">
                            <li @click="saveFile('all data', 'csv')" class="export__sideMenu__item">
                                {{ $t('record.export_csv') }}</li>
                            <li @click="saveFile('all data', 'xls')" class="export__sideMenu__item">
                                {{ $t('record.export_xls') }}</li>
                        </ul>
                        <label for="exportCurrentPage">
                            {{ $t('record.All_page') }} <img alt="img failed" src="\arrow_right.svg">
                        </label>
                    </li>
                </ul>
                <label ref="exportMenuRef" for="exportRecord" class="export__label">
                    {{ $t('record.Export') }} <img alt="img failed" src="\arrow_down.svg">
                </label>
            </div>
        </div>
    </div>

    <!-- 這是圖表的ToolBar -->
    <!-- <div class="toolbar" v-show="$route.name === 'graph'">
        <div class="toolbar__left">
            <div class="search">
                <button @click="isAdvancedSearchMenuOpen = !isAdvancedSearchMenuOpen" class="search__filter"
                    type="submit"><img alt="img failed" src="\filter_alt.svg" ></button>
                <input @keyup.enter="searchChannel(searchInput)" v-model="searchInput" type="text" class="search__input"
                    size="1" :placeholder="t('record.Search_here')">
                <button @click="cleanSearchInput" class="search__canceled" type="submit"><img alt="img failed" src="\close.svg"
                        ></button>
                <button @click="searchChannel(searchInput)" class="search__icon" type="submit"><img alt="img failed" src="\search.svg"
                        ></button>
                <ul class="search__filter__menu" :class="{ 'search__filter__menu__toggle': isAdvancedSearchMenuOpen }">
                    <li :class="{ 'checked': checkStNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkStNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">Stream name</div>
                    </li>
                    <li :class="{ 'checked': checkEtNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkEtNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">Event name</div>
                    </li>
                    <li :class="{ 'checked': checkRdNameSearched }" class="search__filter__menu__item btn">
                        <label class="search__filter__menu__item__checkbox">
                            <input v-model="checkRdNameSearched" type="checkbox">
                            <div></div>
                        </label>
                        <div class="search__filter__menu__item__text">Road name</div>
                    </li>
                    <div class="search__filter__menu__apply">
                        <button @click="applySearchType" class="btn">Apply</button>
                    </div>
                </ul>
            </div>
        </div>
        <div class="toolbar__right">
            <div @click="gotoRecordList" class="soloButton btn">
                <img alt="img failed" src="\list.svg">
            </div>
            <div class="export dropDownMenu btn">
                <input v-model="isExportMenuOpen" type="checkbox" id="exportRecord">
                <ul class="export__menu w-160">
                    <li class="export__menu__item dropDownMenu">
                        <label for="exportCheckedRecord">
                            Export PDF
                        </label>
                    </li>
                    <li class="export__menu__item dropDownMenu">
                        <label for="exportCurrentPage">
                            Export jpg
                        </label>
                    </li>
                </ul>
                <label for="exportRecord" class="export__label">
                    Export <img alt="img failed" src="\arrow_down.svg">
                </label>
            </div>
        </div>
    </div> -->

</template>

<style lang="scss" scoped>
.w-160 {
    width: 10rem !important;
}

.normalcancel{
    opacity: 0.36;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 3.9vh;
    margin-bottom: 1.6vh;

    &__left {
        display: flex;
        width: fit-content;
    }

    &__right {
        display: flex;
        justify-content: flex-end;
    }
}

.dropDownMenu {
    cursor: pointer;
    position: relative;

    & input {
        display: none;
    }

    & label {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 0.875rem;
        cursor: pointer;

        & img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.125rem;
            height: 1.125rem;
            margin-left: 0.5rem;
        }
    }

    & ul {
        position: absolute;
        z-index: 99;
        display: flex;
        flex-direction: column;
        padding: 0.5rem 0;
        border-radius: 4px;
        transform-origin: top;
        transform: scale(1, 0);
        opacity: 0;
        transition: transform 0.3s ease-out;
        background: #515764;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

        & li {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
            background: #515764;
            width: 100%;
            height: 3.9vh;
            white-space: nowrap;
            padding: 0.625rem 0.75rem;
            font-size: 0.875rem;
            color: #FFFFFF;
            cursor: pointer;
        }

        & li:first-child {
            border-top: 1px solid #00000040;
        }

        & li:hover {
            background: #656C74;
        }

        & li:active {
            background: #3A9376;
        }
    }

    & input[type=checkbox]:checked~ul {
        opacity: 1;
        transform: scale(1, 1);
        transition: transform 0.8s ease-in-out;
        transition: opacity 0.1s ease-in-out;
    }
}

.soloButton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.9vh;
    height: 3.9vh;
    margin-right: 0.5rem;
    background-color: #515764;
    border-radius: 0.25rem;

    & img {
        width: 1.125rem;
        height: 1.125rem;
    }
}

.category {
    &__menu {
        top: 4.296vh;
        left: 0rem;
        min-width: 7.125rem;
    }
}

.export {
    &__menu {
        width: 11rem;
        top: 4.296vh;
        right: 0rem;

        &__item {
            position: static;

            &.disabled,
            &.disabled label {
                cursor: not-allowed;
                opacity: 0.60;
                user-select: none;
            }

            &.disabled ul {
                display: none;
            }

            &.disabled:hover {
                background: #515764;
            }
        }
    }

    &__sideMenu {
        width: 10rem;
        top: 0rem;

        &.left {
            left: -10.25rem;
        }

        &.right {
            right: -10.25rem;
        }
    }
}

.category,
.export {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 3.9vh;
    background-color: #515764;
    border-radius: 0.25rem;

    &__label {
        padding: 0 1rem;
    }
}


.search {
    position: relative;
    width: 25rem;
    height: 3.9vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #444A54;
    border-radius: 4px;
    flex-wrap: nowrap;
    margin-left: 0.5rem;

    &__filter {
        position: relative;
        height: 0.75rem;
        margin: 0.8rem 1rem;
        flex-shrink: 1;
        flex-basis: 0.75rem;

        &__menu {
            position: absolute;
            top: 4.218vh;
            z-index: 80;
            display: flex;
            flex-direction: column;
            width: 10rem;
            padding: 0.5rem 0;
            border-radius: 4px;
            transform-origin: top;
            transform: scale(1, 0);
            opacity: 0;
            transition: transform 0.3s ease-out;
            background: #515764;
            box-shadow: 0px 4px 10px 0px #00000080;

            &__toggle {
                transform: scale(1, 1);
                transition: transform 0.8s ease-in-out;
                transition: opacity 0.1s ease-in-out;
                opacity: 1;
            }

            &__item {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #00000040;
                background: #515764;
                width: 100%;
                height: 3.9vh;
                white-space: nowrap;
                padding: 0.625rem 0.75rem;

                &__checkbox {
                    & div {
                        margin: 0 0.6875rem 0 0;
                        width: 1.375rem;
                        height: 1.375rem;
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

                    & input[type=checkbox]:checked+div {
                        background: url(/check_box_table.svg) no-repeat;

                        &:hover {
                            background: url(/check_box_table_hover.svg) no-repeat;
                        }
                    }
                }

                &__text {
                    display: flex;
                    align-items: center;
                    font-size: 0.875rem;
                    color: #FFFFFF;
                }
            }

            &__item:first-child {
                border-top: 1px solid #00000040;
            }

            &__item:hover {
                background: #656C74;
            }

            &__item:active {
                background: #3A9376;
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

    &__icon,
    &__canceled {
        height: 0.75rem;
        margin: 0.8rem 0.8rem;
        flex-shrink: 1;
        flex-basis: 0.75rem;
    }

    & button {
        padding: 0;
    }

    &__input {
        flex-grow: 1;
        flex-shrink: 10;
        font-size: 0.875rem;
        margin: auto 0;
        background: #444A54;
        color: #FFFFFF;
        border: none;

        &::placeholder {
            color: #FFFFFF;
            opacity: 0.36;
        }
    }

    &__icon {
        position: relative;
    }

    &__icon::before {
        position: absolute;
        content: "";
        width: 1.3px;
        height: 0.875rem;
        background: #FFFFFF;
        left: -0.8rem;
        top: 0;
        bottom: 0;
        margin: auto;
    }

}

.btn:hover {
    background: #656C74;
}

.btn:active {
    background: #3A9376;
}
</style>
