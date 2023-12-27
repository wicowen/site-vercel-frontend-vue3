<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecordStore } from '@/stores'

let { isFullScreen, screenShot, screenShotType, screenShotPlate, isScreenshotExisted, isImageImported } = storeToRefs(useRecordStore())
let { turnOffEventScreenshotModal, toggleFullscreen } = useRecordStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasExport = ref<HTMLCanvasElement | null>(null)
const imageSrc = ref<string>('');
const imgRef = ref<HTMLImageElement | null>(null);
const imgInvisible = ref<HTMLImageElement | null>(null);
const downloadLinkRef = ref<HTMLAnchorElement | null>(null);
const canvasHeight = ref(405)
const canvasWidth = ref(720)

const fullScreenStatus = computed(() => {
    if (isFullScreen.value) {
        return 'fullScreenWide'
    } else {
        return ''
    }
})
//畫boundingBox截圖
const drawRect = (imgWidth: number, imgHeight: number, ctx: CanvasRenderingContext2D | null | undefined) => {
    try {
        if (ctx) {
            ctx.strokeStyle = '#FFDD43';
            ctx.lineWidth = 3
            const x = screenShot.value.boundingBoxX * imgWidth
            const y = screenShot.value.boundingBoxY * imgHeight
            const x1 = screenShot.value.boundingBoxX2 * imgWidth
            const y1 = screenShot.value.boundingBoxY2 * imgHeight
            let width: number = Math.abs(x1 - x)
            let height: number = Math.abs(y1 - y)
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    } catch (error) {
        console.error('Failed to get image size:', error);
    }
};

//處理Base64编码的大型图像数据(使用流式处理的方式逐步加载)
const convertBase64ToImage = async (base64: string): Promise<{ width: number; height: number }> => {
    const response = await fetch(`data:image/bmp;base64,${base64}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        imageSrc.value = URL.createObjectURL(blob);
        imgRef.value!.onload = () => {
            const width = imgRef.value!.width;
            const height = imgRef.value!.height;
            resolve({ width, height });
        }
        imgRef.value!.onerror = (error) => {
            console.log(error)
            reject(error)
        }
    })
};

const exportAsImage = (fileType: string) => {
    const canvas = canvasExport.value;
    const img = imgRef.value;
    const downloadLink = downloadLinkRef.value;

    if (canvas && img && downloadLink) {
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            // drawRect(canvas.width, canvas.height, context)
            const image = canvas.toDataURL(`image/${fileType}`);
            // 在这里可以将 image 数据发送到服务器或进行其他操作
            // 也可以将它设置为 <img alt="img failed"> 元素的 src 属性来显示导出的图像
            const blob = dataURItoBlob(image);
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = `${screenShotType.value}_${screenShotPlate.value}.${fileType}`;
            downloadLink.click();

            URL.revokeObjectURL(url);
        }
    }
};

const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

const pressEscBtn = (event: any) => {
    console.log('pressEscBtn', event.key);
    
    if (event.key === 'Escape') {
        turnOffEventScreenshotModal()
    }
};

watch(screenShot, async () => {
    if (screenShot.value.imageData) {
        try {
            const { width, height } = await convertBase64ToImage(screenShot.value.imageData);
            canvasHeight.value = height
            canvasWidth.value = width
            isImageImported.value = true
            nextTick(() => {
                const canvas = canvasRef.value;
                const ctx = canvas!.getContext('2d');
                isImageImported.value = true
                // drawRect(width, height, ctx)
            })
        } catch (error) {
            console.error('Failed to convert base64 to image:', error);
        }
    }
}, { deep: true })

onMounted(() => {
    isImageImported.value = false

    // window.addEventListener('keyup', pressEscBtn)
})

onUnmounted(() => {
    // window.removeEventListener('keyup', pressEscBtn)
})

</script>

<template>
    <div class="EventScreenshotModal-mask">
    </div>
    <div class="EventScreenshotModal-container" :id="fullScreenStatus">
        <div class="EventScreenshotModal-top">
            <div class="EventScreenshotModal-top__title">{{ $t('record.Screenshot') }} ({{ screenShotPlate }})</div>
            <button 
                @click="turnOffEventScreenshotModal"
                class="EventScreenshotModal-top__cancelIcon">
                <img alt="img failed" src="\close.svg" >
            </button>
        </div>
        <div class="EventScreenshotModal-middle">
            <div v-show="!isImageImported" class="EventScreenshotModal-middle__loader">
                <img alt="img failed" src="\loader.gif">
            </div>
            <div v-show="!isScreenshotExisted && isImageImported" class="EventScreenshotModal-middle__loadFailed">
                <p>{{ $t('record.Loading_failed') }}</p>
                <img alt="img failed" src="\loaded_failed.png">
            </div>
            <div v-show="isImageImported" class="EventScreenshotModal-middle__wrapper">
                <img ref="imgInvisible" style="display: none;" class="EventScreenshotModal-middle__screenshot"
                    :src="imageSrc" >
                <img ref="imgRef" class="EventScreenshotModal-middle__screenshot" :src="imageSrc" >
                <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"
                    class="EventScreenshotModal-middle__canvas"></canvas>
                <canvas style="display: none;" ref="canvasExport" :width="canvasWidth * 2" :height="canvasHeight * 2"
                    class="EventScreenshotModal-middle__canvas"></canvas>
            </div>
        </div>
        <div class="EventScreenshotModal-bottom">
            <a style="display: none;" ref="downloadLinkRef"></a>
            <button @click="exportAsImage('bmp')" :disabled="!isScreenshotExisted"
                class="EventScreenshotModal-bottom__btn btn">{{ $t('record.Download')
                }}
                BMP</button>
            <button @click="exportAsImage('jpg')" :disabled="!isScreenshotExisted"
                class="EventScreenshotModal-bottom__btn btn">{{ $t('record.Download')
                }}
                JPEG</button>

            <button v-if="isFullScreen" @click="toggleFullscreen" class="EventScreenshotModal-bottom__btn btn">
                <img alt="img failed" src="\end_fullScreen.svg" :disabled="!isScreenshotExisted" >
                {{ $t('record.End_fullscreen') }}
            </button>
            <button v-else @click="toggleFullscreen" :disabled="!isScreenshotExisted"
                class="EventScreenshotModal-bottom__btn btn">
                <img alt="img failed" src="\fullScreen.svg" >
                {{ $t('record.Fullscreen') }}
            </button>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.EventScreenshotModal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 90;
    width: 100vw;
    height: 100vh;
}

.EventScreenshotModal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: #3B414A;
    box-shadow: 0rem .25rem .625rem rgba(0, 0, 0, 0.5);
    border-radius: .5rem;
}

.EventScreenshotModal-top {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 48px;
    background: #444A54;
    border-radius: .5rem .5rem 0 0;

    &__title {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 16px;
        font-weight: 500;
    }

    &__cancelIcon {
        position: absolute;
        top: 24px;
        right: 24px;
        transform: translate(50%, -50%);

        & img {
            width: 11.68px;
            height: 11.68px;
        }
    }
}

.EventScreenshotModal-middle {
    display: flex;
    flex-grow: 1;
    width: fit-content;
    height: 405px;
    max-width: 100%;
    padding: 20px;
    justify-content: center;

    &__loader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
            width: 60px;
            height: 60px;
        }
    }

    &__loadFailed {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        & p {
            font-size: 1.375rem;
            margin-bottom: .7rem;
        }

        & img {
            width: 20.5rem;
            height: 17.9375rem;
        }
    }

    &__wrapper {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: flex-end;
        width: fit-content;
        height: fit-content;
    }

    &__screenshot {
        height: 365px;
        width: auto;
    }

    &__canvas {
        position: absolute;
        height: 365px;
        width: auto;
    }
}

.EventScreenshotModal-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    width: 100%;
    background: #454B53;
    border-radius: 0 0 .5rem .5rem;
    padding: 12px;

    &__btn {
        display: flex;
        align-items: center;
        padding: 10px 28px;
        margin-left: 8px;
        border-radius: .25rem;
        width: fit-content;
        height: 40px;
        color: #FFFFFF;
        background: #515764;

        & img {
            width: 18px;
            height: 18px;
            margin-right: 8px;
        }
    }
}


#fullScreenWide {
    height: 100vh;
    width: 100vw;

    & .EventScreenshotModal-top {
        flex-shrink: 0;
    }

    & .EventScreenshotModal-middle {
        width: 100%;
        height: 100%;
        justify-content: center;

        &__wrapper {
            width: fit-content;
        }

        &__screenshot,
        &__canvas {
            height: calc(100vh - 152px);
            image-rendering: optimizeQuality;
        }
    }

    & .EventScreenshotModal-bottom {
        justify-content: flex-end;
    }
}
</style>