import Swal from 'sweetalert2'

export const swalSuccessModal = Swal.mixin({
    customClass: {
        icon: 'swalIcon',
        title: 'swalTitle'
    },
    position: 'top-end',
    toast: true,
    width: 'auto',
    color: '#FFFFFF',
    timer: 5000,
    showConfirmButton: false,
    icon: 'question',
    background: '#3A9376D9',
    iconHtml: '✓',
    // iconHtml: `<img alt="img failed" src="\\\check_circle.svg">`,
})
export const swalAlertModal = Swal.mixin({
    customClass: {
        icon: 'swalIcon',
        title: 'swalTitle'
    },
    position: 'top-end',
    toast: true,
    width: 'auto',
    color: '#FFFFFF',
    timer: 5000,
    showConfirmButton: false,
    icon: 'question',
    background: '#B59A0CD9',
    iconHtml: '！',
})
export const swalErrorModal = Swal.mixin({
    customClass: {
        icon: 'swalIcon',
        title: 'swalTitle'
    },
    position: 'top-end',
    toast: true,
    width: 'auto',
    color: '#FFFFFF',
    timer: 5000,
    showConfirmButton: false,
    icon: 'question',
    background: '#B7182BD9',
    // iconHtml: '<img alt="img failed" src="\\\error_circle_rounded.svg">',
    iconHtml: '✕',
})

const toasts: typeof Swal[] = []
export const testSwal = (message: string) => {
    const toast = Swal.mixin({
        customClass: {
            icon: 'swalIcon',
            title: 'swalTitle'
        },
        position: 'top-end',
        toast: true,
        width: 'auto',
        color: '#FFFFFF',
        timer: 5000,
        showConfirmButton: false,
        icon: 'question',
        background: '#B7182BD9',
        iconHtml: '✕',
        didOpen: () => {
            // 刪除已經關閉的 toast
            toasts.forEach((t, index) => {
                if (t.isTimerRunning() === false) {
                    toasts.splice(index, 1);
                }
            });
        },
    })

    // 儲存 toast 實例
    toasts.push(toast);
    // 顯示 toast 提示訊息

    toasts.forEach((i, index) => {
        if (index === 1) {
            i.fire({
                icon: 'success',
                title: message,
            })
            return
        }
        i.fire({
            icon: 'success',
            title: message,
            position: 'bottom-end'
        })
    })
}
export const swalCenterWarnModal = Swal.mixin({
    customClass: {
        htmlContainer: 'swalText',
        title: 'swalTitle',
        confirmButton: 'swalButton',
        cancelButton: 'swalButton',
    },
    width: 'auto',
    text: "This action can not be recovered.",
    icon: 'warning',
    color: '#FFFFFF',
    background: '#3B414A',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: '#515764',
    cancelButtonColor: '#515764',
    confirmButtonText: `Yes`,
    cancelButtonText: 'No',
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    },
})