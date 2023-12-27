<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecordStore } from '@/stores'
import { generateKey, generateVideoUrl } from '@/composables/ezproHelper'
import { swalErrorModal } from '@/composables/swalModal'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
let { isFullScreen, videoId, videoPlate } = storeToRefs(useRecordStore())
let { turnOffEventVideoModal, toggleFullscreen, getVideoApi } = useRecordStore()
// const videoRef = ref<HTMLMediaElement>();
const videoRef = ref();
const isPlaying = ref<boolean>(false)
const isVideoImported = ref(false)
const isVideoLoadFailed = ref(false)

const fullScreenStatus = computed(() => {
    if (isFullScreen.value) {
        return 'fullScreenWide'
    } else {
        return ''
    }
})
const playVideo = () => {
    if (videoRef.value) {
        videoRef.value.play()
        isPlaying.value = true
    }
}
const pauseVideo = () => {
    if (videoRef.value) {
        videoRef.value.pause()
        isPlaying.value = false
    }
}
const onPause = () => {
    isPlaying.value = false;
};
const handleVideoEnded = () => {
    if (videoRef.value) {
        videoRef.value.load(); // Reload the video
    }
};
const handleSeeking = () => {
    // console.log('///////////////////', videoRef.value?.currentTime)
    // console.log('///////////////////', videoRef.value?.duration)
}
const handleSeeked = () => {
    // console.log('-------------------', currentTime.value)
}
const initPlayer = (cameraURL: string) => {
    videoRef.value!.src = cameraURL;
    // videoRef.value!.src = 'https://web-ch.scu.edu.tw/storage/app/uploads/584/a04/fce/584a04fceb9e7598678467.mp4';
}

onMounted(async () => {
    isVideoImported.value = false
    const item = await getVideoApi(videoId.value)
    if (item === undefined) {
        isVideoLoadFailed.value = true
        isVideoImported.value = true
        swalErrorModal.fire(t('swalErrorModal.Failed_to_access_video'))
        return
    }
    // const item: VideoInfo = {
    //     systemId: "56fb6b49-affd-4bf8-8a1d-044dde1f395b",
    //     url: "192.168.1.28:7011",
    //     username: "admin",
    //     password: "108io111",
    //     cameraId: "0c21e8f4-1395-3d93-101f-24078b8cabf2",
    //     start: "2023-08-07T10:00:00",
    //     end: "2023-08-07T10:00:10",
    // }
    const authKey = await generateKey(item.url, item.username, item.password)
    generateVideoUrl(item.url, item.cameraId, item.start, item.end, authKey, initPlayer)



    if (videoRef.value) {
        videoRef.value.onloadedmetadata = () => {
            isVideoImported.value = true
        }
    }
})

const currentTime = ref<number>(0);
function handleTimeUpdate() {
    // if (videoRef.value) {
    //     currentTime.value = videoRef.value.currentTime;
    // }
}
function rewind() {
    const rewindAmount = 2; // 回退5秒
    videoRef.value!.currentTime -= rewindAmount;
}
function fastForward() {
    const fastForwardAmount = 2; // 快进5秒
    // console.log('影片進度條最大值', videoRef.value!.seekable);
    videoRef.value!.play()
    videoRef.value!.currentTime += fastForwardAmount;
    // videoRef.value!.play()

}
function videoBuffer() {
    // console.log('buffered---------', videoRef.value!.buffered.end(0));
    // console.log('buffered---------', videoRef.value!.buffered.start(0));
    // console.log('duration---------', videoRef.value!.duration);
}
</script>

<template>
    <div class="EventVideoModal-mask">
    </div>
    <div class="EventVideoModal-container" :id="fullScreenStatus">
        <div class="EventVideoModal-top">
            <div class="EventVideoModal-top__title">{{ $t('record.Video') }} ({{ videoPlate }})
            </div>
            <button @click="turnOffEventVideoModal" class="EventVideoModal-top__cancelIcon">
                <img alt="img failed" src="\close.svg">
            </button>
        </div>
        <div class="EventVideoModal-middle">
            <div v-show="!isVideoImported" class="EventVideoModal-middle__loader">
                <img alt="img failed" src="\loader.gif">
            </div>
            <div v-show="isVideoLoadFailed && isVideoImported" class="EventVideoModal-middle__loadFailed">
                <p>{{ $t('record.Loading_failed') }}</p>
                <img alt="img failed" src="\loaded_failed.png">
            </div>
            <div v-show="!isVideoLoadFailed && isVideoImported" class="EventVideoModal-middle__wrapper">
                <video @ended="handleVideoEnded" controls preload="auto" autoplay muted id="video" ref="videoRef"
                    class="EventVideoModal-middle__video"></video>
                <!-- <video @play="videoBuffer()" @timeupdate="handleTimeUpdate" controls preload="auto" autoplay muted
                        id="video" @seeking="handleSeeking" @seeked="handleSeeked" @ended="handleVideoEnded"
                        @pause="onPause" ref="videoRef" class="EventVideoModal-middle__video"></video> -->
                <!-- <input style="width:700px" @input="handleProgressChange" type="range" v-model="currentTime" :min="0"
                        :max="duration" step="0.1" /> -->
                <!-- <img alt="img failed" v-if="!isPlaying" @click="playVideo" class="EventVideoModal-middle__videoControl"
                        src="\playVideo.svg" >
                    <img alt="img failed" v-else @click="pauseVideo" class="EventVideoModal-middle__videoControl"
                        src="\pause_video.svg" > -->
            </div>
        </div>
        <div class="EventVideoModal-bottom">
            <button v-if="isFullScreen" @click="toggleFullscreen" class="EventVideoModal-bottom__btn btn"
                :disabled="isVideoLoadFailed">
                <img alt="img failed" src="\end_fullScreen.svg">
                {{ $t('record.End_fullscreen') }}
            </button>
            <button v-else @click="toggleFullscreen" class="EventVideoModal-bottom__btn btn" :disabled="isVideoLoadFailed">
                <img alt="img failed" src="\fullScreen.svg">
                {{ $t('record.Fullscreen') }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.EventVideoModal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 90;
    width: 100vw;
    height: 100vh;
}

.EventVideoModal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #3B414A;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
}

.EventVideoModal-top {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 3rem;
    background: #444A54;
    border-radius: 8px 8px 0 0;

    &__title {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 1rem;
        font-weight: 500;
    }

    &__cancelIcon {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        transform: translate(50%, -50%);

        & img {
            width: 0.73rem;
            height: 0.73rem;
        }
    }
}

.EventVideoModal-middle {
    position: relative;
    display: flex;
    flex-grow: 1;
    width: 45rem;
    max-width: 100%;
    height: 28.3125rem;
    padding: 1.25rem;
    justify-content: center;
    align-items: center;

    &__loader {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        & img {
            width: 3.75rem;
            height: 3.75rem;
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
    }

    &__videoControl {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 7.25rem;
        width: 7.25rem;
        opacity: 0;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }

    &__video {
        height: 25.3125rem;
        width: auto;

        &:hover~img {
            opacity: 0.5;
        }
    }
}

.EventVideoModal-bottom {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 4rem;
    width: 100%;
    background: #454B53;
    border-radius: 0 0 8px 8px;
    padding: .75rem;

    &__btn {
        display: flex;
        align-items: center;
        padding: .625rem 1.75rem;
        margin-left: .5rem;
        border-radius: 4px;
        width: fit-content;
        height: 2.5rem;
        color: #FFFFFF;
        background: #515764;

        & img {
            width: 1.125rem;
            height: 1.125rem;
            margin-right: .5rem;
        }
    }
}


#fullScreenWide {
    height: 100vh;
    width: 100vw;

    & .EventVideoModal-top {
        flex-shrink: 0;
    }

    & .EventVideoModal-middle {
        height: 100%;
        width: 100%;
        justify-content: center;

        &__wrapper {
            width: fit-content;
        }

        &__video {
            height: calc(100vh - 9.5rem);
            image-rendering: optimizeQuality;
        }
    }

    & .EventVideoModal-bottom {
        justify-content: flex-end;
    }
}
</style>