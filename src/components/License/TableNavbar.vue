<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue"
import { storeToRefs } from 'pinia'
import { useRecordStore, useGeneralStore } from '@/stores'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

import type { Column } from '@/composables/models'
import { swalErrorModal } from '@/composables/swalModal'
import { useI18n } from 'vue-i18n';
import { useWindowSize } from '@vueuse/core'
import moment from 'moment'


const { width } = useWindowSize()
const { language } = useGeneralStore()
const { t } = useI18n();
const { getRecordByPageApi, getRecordTotalPageApi, resetCurrentPage, toggleHideStreamButton } = useRecordStore()
const { timeInterval, vehicleTypeShowed, currentPage, startPeriod, endPeriod, totalItem, selectList, resetTiming, isHideStreamFilter } = storeToRefs(useRecordStore())
let transportType = ref<string[]>([t('record.Truck'), t('record.Bus'), t('record.Car'), t('record.Motorbike'), t('record.Bike'), t('record.Person')])
let isTypeShowed = ref<boolean[]>([true, true, true, true, true, true])
let timeIntervalList = ref<string[]>([t('record.1hour'), t('record.1day'), t('record.1week')])
let isPeriodMenuOpen = ref<boolean>(false)
let isVehicleTypeMenuOpen = ref<boolean>(false)
let isTimeIntervalMenuOpen = ref<boolean>(false)
let timeIntervalShowed = ref<string>(t('record.1hour'))
let timeIntervalMenuRef = ref<HTMLElement | null>()
const startDateTime = ref<Date>(startPeriod.value)
const endDateTime = ref<Date>(endPeriod.value)

const toolTipsTime = computed(() => {
    return `${startDateShow.value} ~ ${endDateShow.value}`
})

const rules = ref({
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
});
const calendarMasksWithTime = ref({
    inputDateTime: "YYYY/MM/DD, h:mm A",
});
const calendarMasksNoTime = ref({
    inputDateTime: "YYYY/MM/DD",
});

const calendarMode = computed(() => {
    if (timeInterval.value === 1) return 'dateTime'
    return 'date'
})
const calendarMasks = computed(() => {
    if (timeInterval.value === 1) return calendarMasksWithTime.value
    return calendarMasksNoTime.value
})
const startDateShow = computed(() => {
    const year = startPeriod.value.getFullYear()
    const month = startPeriod.value.getMonth() + 1
    const day = startPeriod.value.getDate()
    let h = startPeriod.value.getHours()
    if (h > 12) h = h - 12
    const a = startPeriod.value.toLocaleString('en-US', { hour12: true }).split(',')[1].trim().split(' ')[1]
    if (timeInterval.value === 1) return `${year}/${month}/${day}, ${h}:00 ${a}`
    return `${year}/${month}/${day}`
})
const endDateShow = computed(() => {
    const year = endPeriod.value.getFullYear()
    const month = endPeriod.value.getMonth() + 1
    const day = endPeriod.value.getDate()
    let h = endPeriod.value.getHours()
    if (h > 12) h = h - 12
    const a = endPeriod.value.toLocaleString('en-US', { hour12: true }).split(',')[1].trim().split(' ')[1]
    if (timeInterval.value === 1) return `${year}/${month}/${day}, ${h}:00 ${a}`
    return `${year}/${month}/${day}`
})
const closePeriodMenu = () => {
    isPeriodMenuOpen.value = false
    endDateTime.value = new Date()
    startDateTime.value = new Date()
    startDateTime.value.setMonth(startDateTime.value.getMonth() - 1)
}
const setPeriodOk = async () => {
    const now = moment().add(1, 'hour'); // 获取当前时间
    const notFutureTime = now.isAfter(moment(endDateTime.value)) && now.isAfter(moment(startDateTime.value))

    if (!notFutureTime) {
        swalErrorModal.fire(t('swalErrorModal.Prohibit_future_time_queries'))
        return
    }

    if (endDateTime.value < startDateTime.value) {
        swalErrorModal.fire(t('swalErrorModal.End_date_cannot_be_later_than_start_date'))
        return
    }
    isPeriodMenuOpen.value = false
    if (timeInterval.value !== 1) startDateTime.value.setHours(0)
    startPeriod.value = startDateTime.value
    endPeriod.value = endDateTime.value
    resetCurrentPage()
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
}
const changeTimeInterval = (value: string) => {
    timeIntervalShowed.value = value
    if (value === timeIntervalList.value[0]) timeInterval.value = 1
    if (value === timeIntervalList.value[1]) timeInterval.value = 24
    if (value === timeIntervalList.value[2]) timeInterval.value = 168
}
const changeVehicleTypeShowed = async () => {
    isVehicleTypeMenuOpen.value = false
    vehicleTypeShowed.value.forEach((item: Column, index) => {
        item.visible = isTypeShowed.value[index]
    })
    await getRecordByPageApi(currentPage.value)
}
const handleResetAll = () => {
    isTypeShowed.value = [true, true, true, true, true, true]
    timeIntervalShowed.value = t('record.1hour')
}
const handleDisableStream = async () => {
    toggleHideStreamButton()
    resetCurrentPage()
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
}
const autoClosedDropdown = (e: Event) => {
    const targetElement = e.target as HTMLElement | null;
    if (!targetElement) return
    if (isTimeIntervalMenuOpen.value && !timeIntervalMenuRef.value?.contains(targetElement as Node)) {
        isTimeIntervalMenuOpen.value = false
    } else if (isVehicleTypeMenuOpen.value && !targetElement.closest('.vehicleType__menu')) {
        isVehicleTypeMenuOpen.value = false
    } else if (isPeriodMenuOpen.value && !targetElement.closest('.period__menu')) {
        isPeriodMenuOpen.value = false
    }
}

watch(resetTiming, async () => {
    handleResetAll()
})

watch(timeInterval, async () => {
    if (timeInterval.value !== 1) startPeriod.value.setHours(0)
    resetCurrentPage()
    await getRecordByPageApi(1)
    await getRecordTotalPageApi()
})

onMounted(() => {
    document.addEventListener('click', autoClosedDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', autoClosedDropdown);
});

const screenWidth = ref(width)
watch(width, (newWidth) => {
    screenWidth.value = newWidth
});
</script>

<template>
    <div class="navbar">
        <div class="navbar__left">
            <div class="count">{{ $t('record.Total_checked') }}: {{ totalItem }}, {{ $t('record.Checked') }}: {{
                selectList.length
            }}</div>
            <div v-show="$route.name === 'tableTFA'" class="vehicleType dropDownMenu">
                <input v-model="isVehicleTypeMenuOpen" type="checkbox" id="tableVehicleType">
                <ul class="vehicleType__menu">
                    <li v-for="(value, key) in transportType" :key="key" 
                        :class="{ 'checked': isTypeShowed[key] }"
                        class="vehicleType__menu__item btn">
                        <label class="vehicleType__menu__item__checkbox">
                            <input v-model="isTypeShowed[key]" type="checkbox">
                            <div></div>
                        </label>
                        <div class="vehicleType__menu__item__text">{{ value }}</div>
                    </li>
                    <div class="vehicleType__menu__apply">
                        <button @click="changeVehicleTypeShowed" class="btn">{{ $t('record.Apply') }}</button>
                    </div>
                </ul>
                <label for="tableVehicleType" class="vehicleType__label">
                    {{ $t('record.Vehicle_type') }} <img alt="img failed" src="\arrow_down.svg">
                </label>
            </div>
            <div v-show="$route.name === 'tableTFA'" class="timeInterval dropDownMenu">
                <input v-model="isTimeIntervalMenuOpen" type="checkbox" id="tableTimeInterval">
                <ul class="timeInterval__menu">
                    <li v-for="(value, key) in timeIntervalList" @click="changeTimeInterval(value)" :key="key"
                        class="timeInterval__menu__item">{{ value }}</li>
                </ul>
                <label ref="timeIntervalMenuRef" for="tableTimeInterval" class="timeInterval__label">
                    {{ $t('record.Time_interval') }} ({{ timeIntervalShowed }})
                    <img alt="img failed" src="\arrow_down.svg">
                </label>
            </div>
            <div class="hideDisabled">
                <button @click="handleDisableStream" :class="{ active: isHideStreamFilter }" class="hideDisabled__btn">
                    {{ isHideStreamFilter ? $t('record.Show_disabled_streams') : $t('record.Hide_disabled_streams') }}
                </button>
            </div>
        </div>
        <div class="navbar__right">
            <!-- <div class="rwd_button">
                <img alt="img failed" class="rwd_button_img" src="\clock.svg" />
            </div> -->

            <div class="rwd period dropDownMenu">
                <input v-model="isPeriodMenuOpen" type="checkbox" id="tablePeriod">
                <ul class="period__menu">
                    <div class="calender">
                        <div class="calender__label">{{ $t('record.Starting') }}</div>
                        <div class="calender__setting">
                            <DatePicker 
                                v-model="startDateTime"
                                :max-date='new Date()' 
                                :locale="language ? language : 'en'" 
                                :masks="calendarMasks" 
                                :mode="calendarMode" 
                                :rules="rules" 
                                color="green" 
                                hide-time-header
                                :is-dark=true
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <input class="px-3 py-1 border rounded" :value="inputValue" v-on="inputEvents" />
                                </template>
                            </DatePicker>
                        </div>
                    </div>
                    <div class="calender">
                        <div class="calender__label">{{ $t('record.Ending') }}</div>
                        <div class="calender__setting">
                            <DatePicker 
                                v-model="endDateTime"
                                :max-date='new Date()' 
                                :locale="language ? language : 'en'" 
                                :masks="calendarMasks" 
                                :mode="calendarMode" 
                                :rules="rules" 
                                color="green"
                                hide-time-header 
                                :is-dark=true
                            >
                                <template #default="{ inputValue, inputEvents }">
                                    <input class="px-3 py-1 border rounded" :value="inputValue" v-on="inputEvents" />
                                </template>
                            </DatePicker>
                        </div>
                    </div>
                    <div class="period__button">
                        <button @click="closePeriodMenu" class="btn">{{ $t('record.Cancel') }}</button>
                        <button @click="setPeriodOk" class="btn">{{ $t('record.OK') }}</button>
                    </div>
                </ul>

                <label v-show="screenWidth > 1024" for="tablePeriod" class="period__label">
                    {{ startDateShow }} ~ {{ endDateShow }}
                </label>
                <label 
                    v-tooltip="toolTipsTime" 
                    v-show="screenWidth <= 1024" 
                    for="tablePeriod" class="rwd_button"
                >
                    <img alt="img failed" class="rwd_button_img" src="\clock.svg" />
                </label>

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rwd_button {
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-radius: 4px;
    background: #515764;
    cursor: pointer;
}

.rwd_button_img {
    margin-right: 0.5rem;
}

.navbar {
    display: flex;
    width: 100%;
    height: 5.4vh;
    justify-content: space-between;
    background-color: #444A54;
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 0 1rem;

    &__left,
    &__right {
        display: flex;
        align-items: center;
    }
}

.vehicleType {
    margin-right: 0.25rem;

    &__menu {
        &__toggle {
            transform: scale(1, 1);
            transition: transform 0.8s ease-in-out;
            transition: opacity 0.1s ease-in-out;
            opacity: 1;
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
                display: flex;
                align-items: center;
                font-size: 0.875rem;
                color: #FFFFFF;
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

.period,
.vehicleType,
.timeInterval {
    &:hover {
        background: #656C74;
    }

    &:active {
        background: #3A9376;
    }

    &__menu {
        width: 100%;
        top: 4.296vh;
    }

    &__label {
        padding: 0 1rem;
    }
}

.dropDownMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.9vh;
    background-color: #515764;
    border-radius: 0.25rem;
    position: relative;
    cursor: pointer;

    & input {
        display: none;
    }

    & label {
        display: flex;
        align-items: center;
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
        z-index: 80;
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

.count {
    display: flex;
    align-items: center;
    margin-right: 0.75rem;
    font-size: 0.875rem;
}

.period {
    display: flex;
    flex-direction: column;
    height: 3.9vh;
    align-items: center;
    background-color: #515764;
    border-radius: 0.25rem;
    font-size: 0.875rem;

    & ul.period__menu {
        width: 338px;
        padding: 0 1rem;
        right: 0;
    }

    &__all {
        padding: 1rem 0;
        display: flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);

        &__text {
            padding-right: 1.5rem;
        }
    }

    & .calender {
        padding: 1rem 0;
        width: 100%;

        & input {
            display: block;
            width: 100%;
            height: 2.5rem;
            background: #323940;
            border-radius: 4px;
            border-style: none;
            margin-top: 0.25rem;
            padding-left: 0.75rem;
            color: #FFFFFF;
            font-size: 0.875rem;
            font-weight: 400;
            font-family: 'Inter';

            &::placeholder {
                color: #FFFFFFB2;
            }
        }

        &__label {
            font-weight: 700;
            font-size: 0.875rem;
            line-height: 1.25rem;
        }

        &__setting {
            display: flex;
            justify-content: space-between;

            &__date {
                margin-right: 0.5rem;
            }

            &__time {
                margin-left: 0.5rem;
            }

            &__date,
            &__time {
                &__input {
                    display: flex;
                    position: relative;

                    &__icon {
                        position: absolute;
                        right: 0.75rem;
                        top: 0.75rem;
                    }
                }
            }
        }
    }

    &__button {
        margin: 1rem 0;
        display: flex;
        justify-content: flex-end;

        & button {
            width: 5rem;
            height: 3.9vh;
            border: 1px solid #7C8589;
            border-radius: 4px;
            color: #FFFFFF;
            margin-left: 0.5rem;
        }
    }

    .vc-popover-content {
        background-color: #515764;
        border: none;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    }

    &:deep(.vc-dark) {
        --vc-color: var(--vc-white);
        --vc-bg: #2A3036;
        --vc-highlight-solid-bg: #3A9376;
    }

    &:deep(.vc-weekday) {
        color: #FFFFFF;
    }

    &:deep(.vc-green) {
        --vc-accent-50: #3A9376;
        --vc-accent-100: #3A9376;
        --vc-accent-200: #3A9376;
        --vc-accent-300: #3A9376;
        --vc-accent-400: #3A9376;
        --vc-accent-500: #3A9376;
        --vc-accent-600: #3A9376;
        --vc-accent-700: #3A9376;
        --vc-accent-800: #3A9376;
        --vc-accent-900: #3A9376;
    }

    &:deep(.vc-align-right),
    &:deep(.vc-align-left),
    &:deep(.vc-focus) {
        border: none;
    }

    &:deep(.vc-nav-item) {
        color: white;
        font-weight: 500;
    }

    &:deep(.vc-base-select select option) {
        font-size: .875rem;
    }
}

.hideDisabled {
    display: flex;
    align-items: center;
    height: 3.9vh;
    margin-left: 0.75rem;
    cursor: default;

    &__btn {
        height: 100%;
        width: 100%;
        padding: 0px 1.75rem;
        border: 1px solid #7C8589;
        border-radius: 4px;
        color: #FFFFFF;
        font-size: 0.875rem;

        &.active {
            background: #FFFFFF1A;
        }

        &:hover {
            background: #FFFFFF1A;
        }
    }

    .btn:hover {
        background: #656C74;
    }

    .btn:active {
        background: #3A9376;
    }
}
</style>
