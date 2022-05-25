<template>
  <div id="video-call-modal">
    <h2>Video Call: {{ conversation.friendFullName }}</h2>
    <div class="cameras-container">
      <div class="friend-camera">
        <div class="friend-camera__container">
          <video 
            ref="friendCamera" 
            class="friend-camera__source" 
            autoplay
            playsinline
          ></video>
        </div>
      </div>
      <div class="self-camera">
        <div class="self-camera__container">
          <video 
            v-show="cameraOn"
            ref="selfCamera" 
            class="self-camera__source" 
            autoplay 
            muted 
            playsinline
          ></video>
          <div v-show="!cameraOn" class="self-camera__status">
            <div>
              Camera của bạn đang tắt!
            </div>
            <div v-show="!audioOn">
              Micro của bạn đang tắt!
            </div>
          </div>
          <div v-show="!audioOn && cameraOn" class="self-audio__status">
            <b-icon class="" icon="mic-mute-fill"></b-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="action-btns">
      <div 
        class="stop-video-btn"
        :class="{ stoped: !cameraOn }"
        @click="handleStopVideo"
      >
        <b-icon class="action-icon" v-if="cameraOn" icon="camera-video-fill"></b-icon>
        <b-icon class="action-icon" v-else icon="camera-video-off-fill"></b-icon>
      </div>
      <div 
        class="mute-btn"
        :class="{ muted: !audioOn }"
        @click="handleMute"
      >
        <b-icon class="action-icon" v-if="audioOn" icon="mic-fill"></b-icon>
        <b-icon class="action-icon" v-else icon="mic-mute-fill"></b-icon>
      </div>
      <div class="end-call-btn" @click="endVideoCall">
        <b-icon class="action-icon" icon="telephone-x-fill"></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/helpers/socketClient'

export default {
  props: {
    conversation: Object
  },

  data() {
    return {
      call: null,
      selfStream: null,
      selfStreamContraints: {
        audio: true,
        video: true
      },
      audioOn: true,
      cameraOn: true
    }
  },

  methods: {
    async createMediaStream() {
      try {
        this.selfStream = await navigator.mediaDevices.getUserMedia(this.selfStreamContraints)
      } catch(error) {
        console.log(error);
      }
    },

    removeMediaStream() {
      const tracks = this.selfStream.getTracks()
      tracks.forEach(function(track) {
        track.stop()
      });

      this.selfStream = null
    },

    handleStopVideo() {
      this.cameraOn = !this.cameraOn
      this.selfStream.getVideoTracks()[0].enabled = this.cameraOn
    },

    handleMute() {
      this.audioOn = !this.audioOn
      this.selfStream.getAudioTracks()[0].enabled = this.audioOn
    },

    endVideoCall() {
      this.$emit('close')
    }
  },

  created() {
    socket.on('end-video-call', (callInfo) => {
      if( callInfo.receiver === this.conversation.friendId ) {
        this.endVideoCall()
      }
    })
  },

  async mounted() {
    await this.createMediaStream()
    this.$refs.selfCamera.srcObject = this.selfStream
    // this.$refs.friendCamera.srcObject = this.selfStream
    this.call = this.$peer.call(this.conversation.friendId, this.selfStream)
    this.call.on('stream', friendStream => {
      this.$refs.friendCamera.srcObject = friendStream
    })
  },

  destroyed() {
    this.removeMediaStream()
    socket.off('end-video-call')
  }
}
</script>

<style lang="scss" scoped>
#video-call-modal {

}

.cameras-container {
  display: flex;

  .friend-camera {
    flex-basis: 70%;

    &__container {
      margin: 2rem auto;
      width: 700px;
      height: 400px;
      background-color: #ddd;
      border: 1px solid #999;
      border-radius: 1rem;
    }

    &__source {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: contain;
    }
  }

  .self-camera {
    flex-basis: 30%;

    &__container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem auto;
      width: 356px;
      height: 200px;
      background-color: #ddd;
      border: 1px solid #999;
      border-radius: .5rem;
      position: relative;
    }

    &__source {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: inherit;
      transform: rotateY(180deg);
    }

    &__status {
      font-size: 18px;
      font-weight: 700;
      color: #333;

      > div {
        margin: .5rem 0;
        text-align: center;
      }
    }

    .self-audio__status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background-color: #f28a69d6;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, .4);
      transform: translate(-25%, -25%);
    }
  }
}

.action-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  > div {
    width: 42px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 10px;
    box-shadow: 0 0 4px 0px rgba(0, 0, 0, .3);
  }

  .action-icon {
    font-size: 18px;
  }

  @mixin action-btn {
    color: #303030;
    background-color: #fff;

    &.stoped, &.muted {
      color: #fff;
      background-color: #444;
    }

    &:hover {
      filter: brightness(90%);
    }
  }

  .stop-video-btn {
    @include action-btn;
  }

  .mute-btn {
    @include action-btn;
  }

  .end-call-btn {
    color: #fff;
    background-color: #f6382b;

    &:hover {
      filter: brightness(90%);
    }
  }
}
</style>
