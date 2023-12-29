<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { storeToRefs } from 'pinia';
import { useRecordStore } from '@/stores'
const { currentPage, totalPage } = storeToRefs(useRecordStore())
const { getRecordByPageApi } = useRecordStore()

let inputCurrentPage = ref<number>(1)
let pageNumberShowed = ref(6)
const showLeftEllipsis = computed(() => {
    if (totalPage.value > pageNumberShowed.value && currentPage.value > 2) {
        return true
    } else {
        return false
    }
})
const showRightEllipsis = computed(() => {
    if (totalPage.value > pageNumberShowed.value && totalPage.value - currentPage.value > 4) {
        return true
    } else {
        return false
    }
})
const indexNumber = computed(() => {
    let temp = 0
    if (totalPage.value > 5) {
        temp = 4
    } else if (totalPage.value === 5) {
        temp = 3
    } else if (totalPage.value === 4) {
        temp = 2
    } else if (totalPage.value === 3) {
        temp = 1
    } else if (totalPage.value < 3) {
        temp = 0
    }
    return temp
})
const indexStart = computed(() => {
    let temp = 2
    if (currentPage.value === 1) {
        temp = 2
    } else if (totalPage.value - currentPage.value <= 4) {
        temp = totalPage.value - indexNumber.value
    } else {
        temp = currentPage.value
    }
    return temp
})
const indexArray = computed(() => {
    let tempList = []
    for (let i = indexStart.value; i < (indexStart.value + indexNumber.value); i++) {
        tempList.push(i)
    }
    return tempList
})

const changePageByInput = async () => {
    currentPage.value = inputCurrentPage.value
    await getRecordByPageApi(inputCurrentPage.value)
}
const changePageByClick = async (index: number) => {
    currentPage.value = inputCurrentPage.value = index
    await getRecordByPageApi(index)
}
const increasePageNumber = async () => {
    if (currentPage.value < totalPage.value) {
        currentPage.value++
        inputCurrentPage.value = currentPage.value
        await getRecordByPageApi(currentPage.value)
    }
}
const decreasePageNumber = async () => {
    if (currentPage.value > 1) {
        currentPage.value--
        inputCurrentPage.value = currentPage.value
        await getRecordByPageApi(currentPage.value)
    }
}
watch(currentPage, async () => {
    inputCurrentPage.value = currentPage.value
})
</script>

<template>
    <div class="footer">
        <div class="paginator">
            <button @click="decreasePageNumber" class="paginator__btn"><img alt="img failed" src="\arrow_left.svg"></button>
            <div @click="changePageByClick(1)" class="paginator__index" :class="{ 'active': currentPage === 1 }">1</div>
            <div v-if="showLeftEllipsis" class="paginator__ellipsis"><img alt="img failed" src="\union.svg"></div>
            <div @click="changePageByClick(value)" 
                class="paginator__index" 
                v-for="value in indexArray" :key="value"
                :class="{ 'active': currentPage === value }">{{ value }}</div>
                <div v-if="showRightEllipsis" class="paginator__ellipsis"><img alt="img failed" src="\union.svg"></div>
            <div @click="changePageByClick(totalPage)" v-if="totalPage > 1" class="paginator__index"
                :class="{ 'active': currentPage === totalPage }">{{ totalPage
                }}</div>
            <button @click="increasePageNumber" class="paginator__btn"><img alt="img failed"
                    src="\arrow_right.svg"></button>
            <input @keyup.enter="changePageByInput" type="number" class="paginator__input" v-model="inputCurrentPage">
            <button @click="changePageByInput" class="paginator__submit btn">{{ $t('record.Go') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 5.4vh;
    background-color: #444A54;
    border-radius: 0 0 0.5rem 0.5rem;
}

.paginator {
    display: flex;
    justify-content: center;
    align-items: center;

    &__index,
    &__btn {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 0.875rem;
        font-weight: 500;

        &:active {
            background-color: #3A9376;
        }

        &:hover {
            background-color: #515764;
        }
    }

    &__btn {
        height: 1.5rem;
        width: 1.5rem;
    }

    &__index {
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        cursor: pointer;

        &.active {
            background: #3A9376;
            border-radius: 4px;
        }
    }

    &__ellipsis {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 0.25rem;
        height: 1.5rem;
        width: 1.5rem;
    }

    &__input {
        height: 3.125vh;
        width: 2.5rem;
        max-width: max-content;
        margin-left: 0.5rem;
        background-color: #323940;
        border-radius: 4px 0px 0px 4px;
        color: #FFFFFF;
        border: none;
        padding: 0 0.5rem;
        text-align: center;
    }

    & input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    & input[type="number"] {
        /* 隱藏虛擬鍵盤的箭頭圖示 */
        -moz-appearance: textfield;
        appearance: textfield;
    }

    &__submit {
        height: 3.125vh;
        background: #515764;
        border-radius: 0px 4px 4px 0px;
        color: #FFFFFF;
        line-height: 100%;

        &:active {
            background-color: #3A9376;
        }
    }
}

.btn:hover {
    background: #656C74;
}

.btn:active {
    background: #3A9376;
}
</style>
