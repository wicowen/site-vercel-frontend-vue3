<script setup lang="ts">
import { setCookie, getCookie } from '@/composables/cookie'
import { ref, onUnmounted, watch, onMounted } from "vue"
import { swalErrorModal } from '@/composables/swalModal'
import { storeToRefs } from 'pinia'
// import { useAuthStore } from '@/stores'
// import { getIp } from '@/composables/apiHelper'
import type { CurrentUser } from '@/composables/models'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// const { login, encryptPassword, decryptPassword } = useAuthStore()
// const { isFinishLoginProcess } = storeToRefs(useAuthStore())

let userData = ref<CurrentUser>({
    address: '',
    port: '',
    account: '',
    password: '',
})

let isUnFilled = ref({
    ip: false,
    account: false,
    password: false,
})

let isShowPassword = ref<boolean>(true)
let isRememberMe = ref<boolean>(false)

watch(userData, () => {
    console.log('watch userData');
    
    if (userData.value.address && userData.value.port) {
        isUnFilled.value.ip = false
    }
    if (userData.value.account) {
        isUnFilled.value.account = false
    }
    if (userData.value.password) {
        isUnFilled.value.password = false
    }
}, { deep: true })

const showPassword = () => {
    isShowPassword.value = !isShowPassword.value
}

const handleSignIn = async (address: string, port: string, account: string, password: string,) => {
    console.log('handleSignIn', address, port, account, password);

    if (!address || !port || !account || !password) {
        if (!address || !port === true) isUnFilled.value.ip = true
        if (!account === true) isUnFilled.value.account = true
        if (!password === true) isUnFilled.value.password = true
        return
    }

    //密碼以AES加密
    const temp = Object.assign({}, userData.value)

    console.log('handleSignIn', temp);

    if (userData.value.account !== 'admin') temp.password = encryptPassword(temp.password)
    if (isRememberMe.value) {
        setCookie('address', temp.address, 10)
        setCookie('port', temp.port, 10)
        setCookie('account', temp.account, 10)
    } else {
        setCookie('address', '', 10)
        setCookie('port', '', 10)
        setCookie('account', '', 10)
    }
    // const url = getIp(userData.value.address, userData.value.port)
    const result: number = await login(temp)

    console.log('handleSignIn', result);
    

    if (result === 401) {
        userData.value.account = ''
        userData.value.password = ''
        swalErrorModal.fire(t('swalErrorModal.Invalid_username_or_password'))
    } else if (result === 0) {
        swalErrorModal.fire(t('swalErrorModal.Unable_to_establish_connection_with_server'))
    }

}

// const disableNavigation = () => {
//     history.pushState(null, '', location.href)
// }

const pressEnterBtn = (event: any) => {
    if (event.key === 'Enter') {
        handleSignIn(userData.value.address, userData.value.port, userData.value.account, userData.value.password)
    }
}

onMounted(() => {
    userData.value.account = getCookie('account')
    userData.value.address = getCookie('address')
    userData.value.port = getCookie('port')

    if (userData.value.account) isRememberMe.value = true
    // disableNavigation()
    // window.addEventListener('popstate', disableNavigation, false)
    window.addEventListener('keyup', pressEnterBtn)
})

onUnmounted(() => {
    // window.removeEventListener('popstate', disableNavigation)
    window.removeEventListener('keyup', pressEnterBtn)
});
</script>

<template>
    <div class="container">
        <div class="wrapper">
            <div class="title">{{ $t("login.Welcome") }}</div>
            <div class="login">
                <div class="ip" :class="{ unfilled: isUnFilled.ip }">
                    <div class="ip-wrapper">
                        <div class="ip__address">
                            <label for="" class="ip__address__label">{{ $t("login.Address") }}</label>
                            <input autocomplete="new-password" required type="text" class="ip__address__input"
                                :placeholder="$t('login.Enter_IP')" v-model="userData.address">
                        </div>
                        <div class="ip__port">
                            <label for="" class="ip__port__label">{{ $t("login.Port") }}</label>
                            <input autocomplete="new-password" required type="text" class="ip__port__input"
                                v-model="userData.port">
                        </div>
                    </div>
                    <span v-show="isUnFilled.ip" class="warning__text">{{ $t('login.This_field_is_required') }}</span>
                </div>
                <div class="account" :class="{ unfilled: isUnFilled.account }">
                    <label for="" class="account__label">{{ $t("login.Account") }}</label>
                    <input autocomplete="new-password" required type="account" class="account__input"
                        :placeholder="$t('login.Enter_account')" v-model="userData.account">
                    <span v-show="isUnFilled.account" class="warning__text">{{ $t('login.This_field_is_required') }}</span>
                </div>
                <div class="password" :class="{ unfilled: isUnFilled.password }">
                    <label for="" class="password__label">{{ $t("login.Password") }}</label>
                    <input autocomplete="new-password"
                        @keyup.enter="handleSignIn(userData.address, userData.port, userData.account, userData.password)"
                        required v-if="isShowPassword" type="password" class="password__input"
                        :placeholder="$t('login.Enter_password')" v-model="userData.password">
                    <input autocomplete="new-password"
                        @keyup.enter="handleSignIn(userData.address, userData.port, userData.account, userData.password)"
                        required v-else type="text" class="password__input" :placeholder="$t('login.Enter_password')"
                        v-model="userData.password">
                    <button @click.prevent="showPassword" class="password__icon">
                        <img alt="img failed" v-if="isShowPassword" src="\visibility.svg">
                        <img alt="img failed" v-else src="\visibility_off.svg">
                    </button>
                    <span v-show="isUnFilled.password" class="warning__text">{{ $t('login.This_field_is_required') }}</span>
                </div>
            </div>
            <div class="remember">
                <label class="remember__checkbox">
                    <input v-model="isRememberMe" type="checkbox">
                    <div></div>
                </label>
                <div class="remember__text">{{ $t("login.Remember_me") }}</div>
            </div>
            <button class="signInBtn"
                @click.prevent="handleSignIn(userData.address, userData.port, userData.account, userData.password)">{{
                    $t("login.Sign_in") }}</button>
        </div>
    </div>
    <div v-if="!isFinishLoginProcess" class="loader-mask">
        <img alt="img failed" src="\loader.gif">
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #2A3036;
}

.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 25rem;
    height: 30rem;
    background: #3B414A;
    box-shadow: 0px 4px 10px 0px #00000080;
    border-radius: 8px;
}

.loader-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 990;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.098);
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
        width: 3.75rem;
        height: 3.75rem;
    }
}

.title {
    width: 100%;
    height: 2.8rem;
    line-height: 2.8rem;
    margin: 1.5rem 0;
    font-size: 32px;
    text-align: center;
}

.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 15.5rem;
    margin-top: 0.625rem;
    font-size: 0.875rem;

    & label::after {
        content: "*";
        color: #FF9D82;
    }
}

.ip,
.account,
.password {
    width: 100%;
    height: 5.3125rem;
    padding: 0 4.96rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    & input {
        margin-bottom: 0.25rem;
    }

    &.unfilled {
        & label {
            color: #FF9D82;
        }

        & label::after {
            content: "";
        }

        & input {
            border: 1px solid #FF9D82;
        }
    }
}

.ip {
    &-wrapper {
        display: flex;
        height: 100%;
    }

    &__address {
        width: 10.75rem;
        height: 4rem;
        margin-right: 0.5rem;
    }

    &__port {
        width: 3.75rem;
        height: 4rem;
    }
}


.warning__text {
    font-size: 0.75rem;
    color: #FF9D82;
    text-align: end;
}

.password {
    position: relative;

    &__icon {
        position: absolute;
        bottom: 1.8rem;
        right: 5.56rem;
    }

    &__input {
        padding-right: 3rem;
    }
}

.remember {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 5.155rem 1.625rem 5.155rem;

    &__checkbox {
        margin: 0 0.6875rem 0 0;
        width: 1.125rem;
        height: 1.125rem;

        & div {
            margin: 0 0.6875rem 0 0;
            width: 1.125rem;
            height: 1.125rem;
            background: url(/check_box_outline_blank.svg) no-repeat;
            user-select: none;
            cursor: pointer;
        }

        & input[type=checkbox]:checked+div {
            background: url(/check_box.svg) no-repeat;
        }
    }

    &__text {
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: #C1C7CE;
    }
}

.signInBtn {
    height: 3.75rem;
    width: 100%;
    background: #444A54;
    border-radius: 0px 0px 8px 8px;
    font-size: 1.125rem;
    color: #FFFFFF;

    &:hover {
        background: #656C74;
    }

    &:active {
        background: #3A9376;
    }
}

input {
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

    &::placeholder {
        color: #FFFFFFB2;
    }
}

input[type=checkbox] {
    display: none;
}
</style>