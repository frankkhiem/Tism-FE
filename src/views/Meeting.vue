<template>
  <div id="team-meeting">
    <div v-if="pinMode" class="camera-fullscreen">
      <div class="unpin-btn">
        <i 
          class="fa-solid fa-down-left-and-up-right-to-center unpin-icon"
          @click="unPinCamera"
        ></i>
      </div>      
      <div v-show="memberSelected.memberName" class="member-name">
        {{ memberSelected.memberName }}
      </div>
      <video 
        v-show="memberSelected.memberCameraOn === true || memberSelected.memberScreenOn === true"
        ref="cameraFullscreen"
        class="camera__source"
        autoplay
        playsinline
      ></video>
      <div 
        v-show="memberSelected.memberCameraOn === false && !memberSelected.memberScreenOn"
        class="camera__status"
      >
        <img src="@/assets/img/camera-off.png" alt="">
      </div>
      <div v-show="memberSelected.memberAudioOn === false" class="audio__status">
        <b-icon class="" icon="mic-mute-fill"></b-icon>
      </div>
    </div>
    <!--  -->
    <div v-show="!pinMode" class="cameras-container">
      <div class="camera-container self">
        <div v-show="loadingSelfStream" class="loading-video">
          <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
        </div>
        <div v-show="!loadingSelfStream" class="member-name">
          Bạn
        </div>
        <video 
          v-show="!loadingSelfStream && cameraOn"
          ref="selfCamera" 
          class="camera__source"
          autoplay 
          muted 
          playsinline
        ></video>
        <div v-show="!loadingSelfStream && !cameraOn" class="camera__status">
          <div>
            Camera của bạn đang tắt!
          </div>
          <div v-show="!audioOn">
            Micro của bạn đang tắt!
          </div>
        </div>
        <div v-show="!loadingSelfStream && !audioOn && cameraOn" class="audio__status">
          <b-icon class="" icon="mic-mute-fill"></b-icon>
        </div>
      </div>
      <div v-for="(member, index) in members" class="camera-container" :key="index">
        <div class="pin-btn">
          <i 
            class="fa-solid fa-up-right-and-down-left-from-center pin-icon"
            @click="pinCamera(index)"
          ></i>
        </div>
        <div v-show="member.memberCameraOn === undefined" class="loading-video">
          <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
        </div>
        <div v-show="member.memberName" class="member-name">
          {{ member.memberName }}
        </div>
        <video 
          v-show="member.memberCameraOn === true || member.memberScreenOn === true"
          :ref="`membersCamera`"
          class="camera__source"
          autoplay
          playsinline
        ></video>
        <div 
          v-show="member.memberCameraOn === false && !member.memberScreenOn"
          class="camera__status"
        >
          <img src="@/assets/img/camera-off.png" alt="">
        </div>
        <div v-show="member.memberAudioOn === false" class="audio__status">
          <b-icon class="" icon="mic-mute-fill"></b-icon>
        </div>
      </div>
    </div>
    <div class="meeting-actions">
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
      <div class="end-call-btn">
        <b-icon 
          v-if="isOwner" 
          class="action-icon" 
          icon="telephone-x-fill"
          @click="handleEndTeamMeeting"
        ></b-icon>
        <b-icon 
          v-else 
          class="action-icon" 
          icon="arrow-bar-right"
          @click="handleLeaveTeamMeeting"
        ></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import socket from '@/helpers/socketClient'
import createPeer from "@/helpers/peerClient"

export default {
  computed: {
    ...mapGetters({
      isAuth: "userAuthenticated",
      user: 'profile'
    })
  },

  data() {
    return {
      isOwner: false,
      pinMode: false,
      selfStream: null,
      loadingSelfStream: false,
      selfStreamContraints: {
        audio: true,
        video: true
      },
      cameraOn: true,
      audioOn: true,
      screenOn: false,
      myPeer: null,
      myPeerId: null,
      number: 1,
      members: [],
      memberSelected: null
    }
  },

  methods: {
    ...mapActions({
      endTeamMeeting: 'endTeamMeeting'
    }),

    async createMediaStream() {
      try {
        this.selfStream = await navigator.mediaDevices.getUserMedia(this.selfStreamContraints)
      } catch(error) {
        console.log(error);
      }
    },

    async pinCamera(cameraIndex) {
      this.memberSelected = this.members[cameraIndex]
      this.pinMode = true
      await new Promise(resolve => setTimeout(resolve, 1))
      this.$refs.cameraFullscreen.srcObject = this.memberSelected.memberStream
    },

    unPinCamera() {
      this.pinMode = false
    },

    handleStopVideo() {
      this.cameraOn = !this.cameraOn
      this.selfStream.getVideoTracks()[0].enabled = this.cameraOn
      this.members.forEach(member => {
        // console.log(member)
        member.memberDataConnect.send({ cameraOn: this.cameraOn })
      })
    },

    handleMute() {
      this.audioOn = !this.audioOn
      this.selfStream.getAudioTracks()[0].enabled = this.audioOn
      this.members.forEach(member => {
        member.memberDataConnect.send({ audioOn: this.audioOn })
      })
    },

    handleShareScreen() {
      this.screenOn = !this.screenOn
      if( this.screenOn ) {
        this.startShareScreen()
      } else {
        this.stopShareScreen()
      }
    },

    startShareScreen() {
      this.$confirm(
        {
          title: `Chia sẻ màn hình`,
          message: `Khi chia sẻ màn hình, camera của bạn sẽ không được hiển thị với mọi người. Bạn có muốn chia sẻ màn hình không?`,
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
                this.members.forEach(member => {
                  const videoSender = member.memberCall.peerConnection.getSenders().find(sender => {
                    return sender.track.kind === 'video'
                  })
                  videoSender.replaceTrack(this.screenTrack)
                  member.memberDataConnect.send({ screenOn: true })
                })
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
      this.members.forEach(member => {
        const videoSender = member.memberCall.peerConnection.getSenders().find(sender => {
          return sender.track.kind === 'video'
        })
        videoSender.replaceTrack(cameraTrack)
        member.memberDataConnect.send({ screenOn: false })
      })
    },

    handleEndTeamMeeting() {
      this.$confirm(
        {
          title: `Kết thúc cuộc họp`,
          message: `Dừng cuộc họp với tất cả thành viên đang tham gia!`,
          button: {
            no: 'Hủy',
            yes: 'Thực hiện'
          },
          callback: confirm => {
            if (confirm) {
              window.close()
            }
          }
        }
      )
    },

    handleLeaveTeamMeeting() {
      this.$confirm(
        {
          title: `Rời cuộc họp`,
          message: `Bạn muốn rời khỏi cuộc họp này?`,
          button: {
            no: 'Hủy',
            yes: 'Thực hiện'
          },
          callback: confirm => {
            if (confirm) {
              window.close()
            }
          }
        }
      )
    },

    async connectToNewMember(memberData) {
      await new Promise(resolve => setTimeout(resolve, 1500)) 

      const dataConnect = this.myPeer.connect(memberData.peerId)
      dataConnect.on('data', data => {
        console.log('nhan duowc: ', data)
        if( Object.prototype.hasOwnProperty.call(data, 'cameraOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberCameraOn = data.cameraOn
          this.$set(this.members, existMemberIndex, member)
          // this.members[existMemberIndex].memberCameraOn = data.cameraOn
        }
        if( Object.prototype.hasOwnProperty.call(data, 'audioOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberAudioOn = data.audioOn
          this.$set(this.members, existMemberIndex, member)
        }
        if( Object.prototype.hasOwnProperty.call(data, 'screenOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberScreenOn = data.screenOn
          this.$set(this.members, existMemberIndex, member)
        }
      })
      dataConnect.on('close', () => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === dataConnect.peer 
        })
        this.members.splice(existMemberIndex, 1)
      })

      const call = this.myPeer.call(memberData.peerId, this.selfStream)
      if( this.screenOn ) {
        const videoSender = call.peerConnection.getSenders().find(sender => {
          return sender.track.kind === 'video'
        })
        videoSender.replaceTrack(this.screenTrack)
      }
      
      const member = {
        memberId: memberData.memberId,
        memberName: memberData.memberName,
        memberPeer: memberData.peerId,
        memberDataConnect: dataConnect,
        memberCall: call,
        memberCameraOn: true,
        memberAudioOn: true,
        memberScreenOn: false
      }
      this.members.push(member)

      call.on('stream', newMemberStream => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === call.peer 
        })
        let member = this.members[existMemberIndex]
        member.memberStream = newMemberStream
        this.$set(this.members, existMemberIndex, member)
        this.renderMember(this.members.length - 1, newMemberStream)
      })      
      call.on('close', () => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === call.peer 
        })
        this.members.splice(existMemberIndex, 1)
      })

      await new Promise(resolve => setTimeout(resolve, 5000))
      dataConnect.send({
        memberId: this.user.userId,
        memberName: this.user.fullname,
        cameraOn: this.cameraOn,
        audioOn: this.audioOn,
        screenOn: this.screenOn
      })
    },

    async renderMember(memberIndex, memberStream) {
      await new Promise(resolve => setTimeout(resolve, 1))
      console.log(this.members)
      this.$refs.membersCamera[memberIndex].srcObject = memberStream
    }
  },

  async created() {
    if( this.$route.query.isOwner === 'true' ) {
      this.isOwner = true
    }
    this.loadingSelfStream = true

    await new Promise(resolve => setTimeout(resolve, 1000))
    // connect to socket server
    socket.auth = {
      userId: this.user.userId
    }
    console.log(this.user.userId)
    socket.connect()
    
    await new Promise(resolve => setTimeout(resolve, 200))
    // connect to peer server
    this.myPeer = createPeer(undefined)    

    this.myPeer.on('open', async (id) => {
      this.myPeerId = id
      console.log(this.myPeerId)
      socket.emit('join-team-meeting', {
        meetingId: this.$route.params.meetingId,
        memberName: this.user.fullname,
        memberId: this.user.userId,
        peerId: id
      })
    })

    this.myPeer.on('connection', dataConnect => {
      dataConnect.on('data', data => {
        console.log('nhan duoc: ', data)
        if( Object.prototype.hasOwnProperty.call(data, 'cameraOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberCameraOn = data.cameraOn
          this.$set(this.members, existMemberIndex, member)
        }
        if( Object.prototype.hasOwnProperty.call(data, 'memberId') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberId = data.memberId
          this.$set(this.members, existMemberIndex, member)
        }
        if( Object.prototype.hasOwnProperty.call(data, 'memberName') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberName = data.memberName
          this.$set(this.members, existMemberIndex, member)
        }
        if( Object.prototype.hasOwnProperty.call(data, 'audioOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberAudioOn = data.audioOn
          this.$set(this.members, existMemberIndex, member)
        }
        if( Object.prototype.hasOwnProperty.call(data, 'screenOn') ) {
          const existMemberIndex = this.members.findIndex(member => {
            return member.memberPeer === dataConnect.peer 
          })
          let member = this.members[existMemberIndex]
          member.memberScreenOn = data.screenOn
          this.$set(this.members, existMemberIndex, member)
        }
      })
      dataConnect.on('close', () => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === dataConnect.peer 
        })
        this.members.splice(existMemberIndex, 1)
      })

      const existMemberIndex = this.members.findIndex(member => {
        return member.memberPeer === dataConnect.peer 
      })

      if( existMemberIndex === -1 ) {
        this.members.push({
          memberPeer: dataConnect.peer,
          memberDataConnect: dataConnect
        })
      } else {
        this.members[existMemberIndex].memberDataConnect = dataConnect
      }
    })

    this.myPeer.on('call', call => {
      let existMemberIndex = this.members.findIndex(member => {
        return member.memberPeer === call.peer 
      })

      if( existMemberIndex === -1 ) {
        this.members.push({
          memberPeer: call.peer,
          memberCall: call
        })
        existMemberIndex = this.members.length - 1
      } else {
        this.members[existMemberIndex].memberCall = call
      }
      call.answer(this.selfStream)
      call.on('stream', memberStream => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === call.peer 
        })
        let member = this.members[existMemberIndex]
        member.memberStream = memberStream
        this.$set(this.members, existMemberIndex, member)
        this.renderMember(existMemberIndex, memberStream)
      })
      call.on('close', () => {
        const existMemberIndex = this.members.findIndex(member => {
          return member.memberPeer === call.peer 
        })
        this.members.splice(existMemberIndex, 1)
      })
    })

    // các listener của socket client
    socket.on('new-member-connected', this.connectToNewMember)
    socket.on('end-team-meeting', meeting => {
      if( meeting._id === this.$route.params.meetingId ) {
        window.close()
      }
    })
  },

  async mounted() {
    await this.createMediaStream()
    this.$refs.selfCamera.srcObject = this.selfStream
    this.loadingSelfStream = false
  },

  destroyed() {
    this.myPeer.off('call')
    socket.off('new-member-connected')
    socket.off('end-team-meeting')
  },

  watch: {
    async members(newValue) {
      await new Promise(resolve => setTimeout(resolve, 0))
      for( let i = 0; i < this.$refs.membersCamera?.length || 0; i++ ) {
        this.$refs.membersCamera[i].srcObject = newValue[i].memberStream
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#team-meeting {
  width: 100vw;
  height: 100vh;
}

.camera-fullscreen {
  width: 100%;
  height: 90%;
  max-height: calc(100% - 60px);
  background-color: #ddd;
  position: relative;

  &:hover {
    .unpin-btn {
      opacity: 1;
    }

    .member-name {
      opacity: 1;
    }
  }

  .unpin-btn {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background-color: rgba(0, 0, 0, .15);
    font-size: 42px;
    color: #fff;
    opacity: 0;
    z-index: 2;
    transition: opacity .2s linear;

    .unpin-icon:hover {
      cursor: pointer;
      transform: scale(.8);
    }
  }

  .member-name {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin-top: 1rem;
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    opacity: 0;
    z-index: 3;
    transition: opacity .2s linear;
  }

  .camera__source {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .camera__status {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      height: 60%;
      object-fit: contain;
    }
  }

  .audio__status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    font-size: 24px;
    color: #fff;
    background-color: #f28a69d6;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, .4);
    transform: translate(-50%, -50%);
  }
}

.cameras-container {
  width: 100%;
  height: 90%;
  max-height: calc(100% - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: auto;

  .camera-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem;
    width: 368px;
    height: 207px;
    background-color: #ddd;
    border: 2px solid #e35110;
    border-radius: .5rem;
    position: relative;

    .pin-btn {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .2);
      border-radius: inherit;
      display: flex;
      opacity: 0;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: #fff;
      transition: opacity .2s linear;
      z-index: 1;

      .pin-icon {
        cursor: pointer;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    &:hover {
      .pin-btn {
        opacity: 1;
      }
    }

    .loading-video img {
      width: 60px;
      height: 60px;
    }

    .member-name {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 60px;
      text-align: center;
      font-size: 18px;
      padding-top: 4px;
      color: #f8ff16;
      background: linear-gradient(180deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0) 100%);
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      z-index: 2;
    }

    .camera__source {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: inherit;
    }

    .camera__status {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      img {
        height: 70%;
        object-fit: contain;
      }
    }

    .audio__status {
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

    &.self {
      background-color: #9abcbf76;
      border: 2px solid #1c64db;

      .member-name {
        color: #1dffd1;
      }

      .camera__source {
        transform: rotateY(180deg);
      }

      .camera__status {
        font-size: 18px;
        font-weight: 700;
        color: #333;

        > div {
          margin: 5px;
          text-align: center;
        }
      }

      .audio__status {
        left: 0;
        background-color: #6997f2d6;
        transform: translate(25%, -25%);
      }
    }
  }
}

.meeting-actions {
  height: 10%;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 14px;
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
