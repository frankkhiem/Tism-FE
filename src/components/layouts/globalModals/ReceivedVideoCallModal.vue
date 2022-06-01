<template>
  <div id="video-call-modal">
    <div class="modal-title">
      <div class="friend-name">
        Đang gọi Video với 
        <span>{{ callInfo.callerName }}</span>
      </div>
      <div class="time-clock">
        <i class="fa-solid fa-circle"></i>
        <span>{{ duringTimesString }}</span>
      </div>
    </div>
    <div class="cameras-container">
      <div class="friend-camera">
        <div class="friend-camera__container">
          <div v-show="loadingFriendStream" class="loading-video">
            <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
          </div>
          <div v-show="!loadingFriendStream && !friendCameraOn" class="friend-camera__off">
            <img src="@/assets/img/camera-off.png" alt="">
          </div>
          <video 
            v-show="!loadingFriendStream && friendCameraOn"
            ref="friendCamera" 
            class="friend-camera__source" 
            autoplay
            playsinline
          ></video>
          <div v-show="!loadingFriendStream && !friendAudioOn" class="friend-audio__off">
            <b-icon class="" icon="mic-mute-fill"></b-icon>
          </div>
        </div>
      </div>
      <div class="self-camera">
        <div class="self-camera__container">
          <div v-show="loadingSelfStream" class="loading-video">
            <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
          </div>
          <video 
            v-show="!loadingSelfStream && cameraOn"
            ref="selfCamera" 
            class="self-camera__source" 
            autoplay 
            muted 
            playsinline
          ></video>
          <div v-show="!loadingSelfStream && !cameraOn" class="self-camera__status">
            <div>
              Camera của bạn đang tắt!
            </div>
            <div v-show="!audioOn">
              Micro của bạn đang tắt!
            </div>
          </div>
          <div v-show="!loadingSelfStream && !audioOn && cameraOn" class="self-audio__status">
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
      <div 
        class="share-screen-btn"
        :class="{ shared: screenOn }"
        @click="handleShareScreen"
      >
        <b-icon class="action-icon" v-if="screenOn" icon="display-fill"></b-icon>
        <b-icon class="action-icon" v-else icon="display"></b-icon>
      </div>
      <div class="end-call-btn" @click="requestEndVideoCall">
        <b-icon class="action-icon" icon="telephone-x-fill"></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/helpers/socketClient'

export default {
  props: {
    callInfo: Object
  },

  computed: {
    duringTimesString() {
      if( this.duringTimes < 3600 ) {
        return new Date(this.duringTimes * 1000).toISOString().substring(14, 19)
      }
      return new Date(this.duringTimes * 1000).toISOString().substring(11, 19)
    }
  },

  data() {
    return {
      dataConnect: null,
      selfStream: null,
      selfStreamContraints: {
        audio: true,
        video: true
      },
      audioOn: true,
      friendAudioOn: true,
      cameraOn: true,
      friendCameraOn: true,
      loadingSelfStream: false,
      loadingFriendStream: false,
      duringTimes: 0,
      screenOn: false
    }
  },

  methods: {
    async createMediaStream() {
      this.selfStream = await navigator.mediaDevices.getUserMedia(this.selfStreamContraints)
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
      this.dataConnect.send({ cameraOn: this.cameraOn, sharedScreen: this.screenOn })
    },

    handleMute() {
      this.audioOn = !this.audioOn
      this.selfStream.getAudioTracks()[0].enabled = this.audioOn
      this.dataConnect.send({ audioOn: this.audioOn })
    },

    handleShareScreen() {
      if( !this.call ) {
        this.$confirm(
          {
            title: `Đang kết nối`,
            message: `Vui lòng đợi kết nối thành công!`,
            button: {
              no: 'Đã hiểu',
            }
          }
        )
      } else {
        this.screenOn = !this.screenOn
        if( this.screenOn ) {
          this.shareScreen()
        } else {
          this.stopShareScreen()
        }
      }
    },

    shareScreen() {
      this.$confirm(
        {
          title: `Chia sẻ màn hình`,
          message: `Khi chia sẻ màn hình, camera của bạn sẽ không được hiển thị với bạn bè. Bạn có muốn chia sẻ màn hình không?`,
          button: {
            no: 'Hủy',
            yes: 'Thực hiện'
          },
          callback: async confirm => {
            if (confirm) {
              try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                  video: true
                })

                this.screenTrack = screenStream.getVideoTracks()[0]
                this.screenTrack.onended = () => {
                  this.stopShareScreen()
                }
                const videoSender = this.call.peerConnection.getSenders().find(sender => {
                  return sender.track.kind === 'video'
                })
                videoSender.replaceTrack(this.screenTrack)
                this.dataConnect.send({ cameraOn: true, sharedScreen: true })
              } catch(e) {
                this.screenOn = false
              }
            } else {
              this.screenOn = false
            }
          }
        }
      )
      
    },

    stopShareScreen() {
      this.screenOn = false
      if( this.screenTrack ) {
        this.screenTrack.stop()
      }
      const cameraTrack = this.selfStream.getVideoTracks()[0]
      const videoSender = this.call.peerConnection.getSenders().find(sender => {
        return sender.track.kind === 'video'
      })
      videoSender.replaceTrack(cameraTrack)
      this.dataConnect.send({ cameraOn: this.cameraOn, sharedScreen: false })
    },

    endVideoCall() {
      this.stopShareScreen()
      this.$emit('close')
    },

    requestEndVideoCall({ error = false }) {
      socket.emit('end-video-call-from-receiver', {
        ...this.callInfo,
        duringTimes: this.duringTimesString
      }, error)
      this.stopShareScreen()
      this.$emit('close')
    },

    handleDropConnectVideoCall(data) {
      if( data.id === this.callInfo.caller ) {
        this.requestEndVideoCall({ error: true })
      }
    }
  },

  created() {    
    setInterval(() => {
      this.duringTimes++
    }, 1000)
    this.loadingSelfStream = true
    this.loadingFriendStream = true
    socket.on('end-video-call', (callInfo) => {
      if( callInfo.caller === this.callInfo.caller ) {
        this.endVideoCall()
      }
    })

    socket.on('friend-offline', this.handleDropConnectVideoCall)
  },

  async mounted() {
    await this.createMediaStream()
    this.$refs.selfCamera.srcObject = this.selfStream
    this.loadingSelfStream = false
    
    // listen data connect from peer object
    this.$peer.on('connection', dataConnect => {
      this.dataConnect = dataConnect
      this.dataConnect.on('data', data => {
        if( Object.prototype.hasOwnProperty.call(data, 'cameraOn') && !data.sharedScreen ) {
          this.friendCameraOn = data.cameraOn
        }
        if( Object.prototype.hasOwnProperty.call(data, 'cameraOn') && data.sharedScreen ) {
          this.friendCameraOn = true
        }
        if( Object.prototype.hasOwnProperty.call(data, 'audioOn') ) {
          this.friendAudioOn = data.audioOn
        }
      })
    })
    // listen call from peer object
    this.$peer.on('call', call => {
      call.answer(this.selfStream)
      call.on('stream', friendStream => {
        this.$refs.friendCamera.srcObject = friendStream
        this.loadingFriendStream = false
      })
      this.call = call
    })
  },

  destroyed() {
    this.removeMediaStream()
    this.$peer.off('connection')
    this.$peer.off('call')
    socket.off('end-video-call')
    socket.off('friend-offline', this.handleDropConnectVideoCall)
  }
}
</script>

<style lang="scss" scoped>
#video-call-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-title {
  .friend-name {
    text-align: center;
    font-size: 24px;
    // margin-top: 1rem;

    span {
      font-weight: 700;
      color: #0e76c6;
      cursor: pointer;

      &:hover {
        color: #10ac94;
      }
    }
  }

  .time-clock {
    margin-top: 2px;
    display: flex;
    align-items: center;    
    padding-left: calc(50% - 2.5rem);
    cursor: default;

    i {
      color: #0fd2b6;
      font-size: 12px;
      margin-right: .5rem;
    }

    span {
      font-size: 16px;
      font-weight: 600;
      user-select: none;
    }
  }
}

.cameras-container {
  display: flex;
  margin-top: 20px;

  .friend-camera {
    flex-basis: 70%;

    &__container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 4rem 0 auto;
      width: 800px;
      height: 450px;
      background-color: #ddd;
      border: 1px solid #999;
      border-radius: 1rem;
      position: relative;

      .loading-video img {
        width: 120px;
        height: 120px;
      }
    }

    &__source {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: contain;
    }

    &__off {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: inherit;

      img {
        width: 60%;
        height: 60%;
        object-fit: contain;
      }
    }

    .friend-audio__off {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 42px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      border-radius: 50%;
      font-size: 20px;
      color: #fff;
      background-color: #6198d8;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, .4);
      transform: translate(50%, -30%);
    }
  }

  .self-camera {
    flex-basis: 30%;

    &__container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 0 0;
      width: 368px;
      height: 207px;
      background-color: #ddd;
      border: 1px solid #999;
      border-radius: .5rem;
      position: relative;

      .loading-video img {
        width: 60px;
        height: 60px;
      }
    }

    &__source {
      width: 100%;
      height: 100%;
      // object-fit: cover;
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

    &.stoped, &.muted, &.shared {
      color: #fff;
      background-color: #444;
    }

    &:hover {
      filter: brightness(90%);
    }
  }

  .stop-video-btn, .mute-btn, .share-screen-btn {
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
