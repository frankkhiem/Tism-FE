<template>
  <div class="conversation-header">
    <div class="conversation-info" @click="toProfile">
      <div class="avatar">
        <img v-if="conversation.friendAvatar" :src="conversation.friendAvatar" alt="">
        <div v-else class="avatar-text">
          {{ conversation.friendFirstNameLetter }}
        </div>
      </div>
      <div class="main-info">
        <div class="friend-name">
          {{ conversation.friendFullName }}
        </div>
        <div v-if="friendStatus === 'online'" class="friend-status">
          <span class="online-badge"></span>
          Online
        </div>
        <div v-else-if="friendStatus === 'offline'" class="friend-status">
          <span class="offline-badge"></span>
          Offline
        </div>
        <div v-else class="friend-status">
          <span class="offline-badge"></span>
          ...
        </div>
      </div>
    </div>
    <div class="conversation-actions">
      <div 
        class="action-btn"
        @click="handleVideoCall"
      >
        <i class="fa-solid fa-video"></i>
      </div>
      <div 
        class="action-btn setting"
        @click="handleShowSetting"
      >
        <i class="fa-solid fa-gear"></i>
        <div 
          v-if="showSetting"
          class="setting-container"
          v-click-outside-element="handleHideSetting"
        >
          <div class="setting-option" @click.stop="unseenConversation">
            Đánh dấu là chưa đọc
          </div>
          <div class="setting-option" @click.stop="settingMore">
            Cài đặt khác
          </div>
        </div>
      </div>
      <div 
        class="action-btn"
        :class="{ activated: showInfo }" 
        @click="toggleInfo"
      >
        <i class="fa-solid fa-circle-info"></i>
      </div>
    </div>
  </div>
</template>

<script>
import InitCallModal from './InitCallModal'
import VideoCallModal from './VideoCallModal'

import { mapGetters, mapActions } from 'vuex'
// import axios from 'axios'
import socket from '@/helpers/socketClient'

export default {
  props: {
    conversation: {
      type: Object
    },
    initVideoCall: Boolean
  },

  computed: {
    ...mapGetters({
      user: 'profile'
    })
  },

  data() {
    return {
      showInfo: false,
      showSetting: false,
      friendStatus: 'offline',
      realtimeOnline: false,
      friendAccept: null,
      callId: null
    }
  },

  methods: {
    ...mapActions({
      getPersonStatus: 'getPersonStatus',
      changeConversationStatus: 'changeConversationStatus',
      unSeenConversation: 'unSeenConversation'
    }),

    toggleInfo() {
      this.showInfo = !this.showInfo
      this.$emit('toggle-info')
    },

    handleShowSetting() {
      setTimeout(() => {
        this.showSetting = true
      }, 0)
    },

    handleHideSetting() {
      setTimeout(() => {
        this.showSetting = false
      }, 1)
    },

    unseenConversation() {
      this.showSetting = false
      this.unSeenConversation(this.conversation.conversationId)
    },

    settingMore() {
      this.showSetting = false
      if( this.showInfo ) return
      this.showInfo = true
      this.$emit('toggle-info')
    },

    toProfile() {
      this.$router.push({
        name: 'PersonInfo',
        params: {
          personId: this.conversation.friendId
        }
      })
    },

    initialCall() {
      this.$modal.show(
        InitCallModal,
        { 
          conversation: this.conversation,
          setConnected: this.setCallConnected,
          setCallId: this.setCallId
        },
        {
          width: '500px',
          height: '150px',
          clickToClose: false
        },
        {
          'closed': this.checkCanceledCall
        }
      )
    },

    checkCanceledCall() {
      if( this.friendAccept === null ) {
        socket.emit('cancel-video-call', {
          callId: this.callId,
          conversationId: this.conversation.conversationId,
          caller: this.user.userId,
          callerName: this.user.fullname,
          receiver: this.conversation.friendId
        })
      }
    },

    setCallConnected(connected) {
      this.friendAccept = connected
    },

    setCallId(callId) {
      this.callId = callId
    },

    startCall() {
      this.$modal.show(
        VideoCallModal,
        { 
          conversation: this.conversation,
          callId: this.callId
        },
        {
          width: '100%',
          height: '100%',
          clickToClose: false
        },
        {
          'closed': this.endCall
        }
      )
    },

    endCall() {
      this.$emit('end-video-call')
    },

    async handleVideoCall() {      
      this.$emit('initialed-video-call')
      const friendStatus = await this.getPersonStatus(this.conversation.friendId)

      if( friendStatus !== 'online' ) {
        let message
        if( friendStatus === 'offline' ) {
          message = `📞 Người dùng này hiện đang offline, hãy thực hiện lại cuộc gọi sau 🟢.`
        } else if( friendStatus === 'busy' ) {
          message = `📞 Người dùng này hiện đang bận, hãy thực hiện lại cuộc gọi sau 🟢.`
        } else {
          message = `📞 Hệ thống đang gặp lỗi, vui lòng thử lại sau.`
        }
        this.$confirm(
          {
            title: `Không thể gọi Video`,
            message,
            button: {
              no: 'Đã hiểu!'
            }          
          }
        )
        return
      }

      this.initialCall()
    },

    async handleFriendOnline(data) {
      if( data.id === this.conversation.friendId ) {
        this.friendStatus = 'online'
        this.realtimeOnline = true
        await this.changeConversationStatus()
      }
    },

    async handleFriendOffline(data) {
      if( data.id === this.conversation.friendId ) {
        setTimeout(() => {
          this.realtimeOnline = false
        }, 500)
        setTimeout(async () => {
          if( !this.realtimeOnline ) {
            this.friendStatus = 'offline'
            await this.changeConversationStatus()
          }
        }, 5000)
      }
    }
  },

  created() {
    socket.on('friend-online', this.handleFriendOnline)

    socket.on('friend-offline', this.handleFriendOffline)
  },

  destroyed() {
    socket.off('friend-online', this.handleFriendOnline)
    socket.off('friend-offline', this.handleFriendOffline)
  },

  watch: {
    conversation(newData) {
      this.friendStatus = newData.friendStatus
      this.realtimeOnline = this.friendStatus === 'online' ? true : false
    },

    friendAccept(connected) {
      if( connected && this.callId ) {
        this.startCall()
      } else if ( connected === null ) {
        return
      } else {
        this.$confirm(
          {
            title: `Gọi Video không thành công`,
            message: `📞 Người dùng này hiện đang bận, vui lòng gọi lại sau.`,
            button: {
              no: 'Đã hiểu!'
            }          
          }
        )
      }
    },

    initVideoCall(isInit) {
      if( isInit ) {
        this.handleVideoCall()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 2rem 0 1rem;
  border-bottom: 1px solid #dfdfdf;
  box-shadow: 0px 2px 6px -3px rgba(9, 30, 66, .2);
}

.conversation-info {
  display: flex;
  padding: 5px 16px 5px 14px;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  .avatar {
    width: 42px;
    height: 42px;
    position: relative;

    &-text {
      width: inherit;
      height: inherit;
      line-height: 42px;
      border-radius: 50%;
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      background-color: #ccc;
    }

    img {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .main-info {
    margin-left: 14px;

    .friend-name {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    .friend-status {
      font-size: 14px;
      line-height: 1.2;
      color: #65676b;

      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 2px;
        border-radius: 50%;

        &.online-badge {
          background-color: #31a24c;
        }

        &.offline-badge {
          background-color: #f1570e;
        }
      }
    }
  }
}

.conversation-actions {
  display: flex;
  align-items: center;

  .action-btn {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    margin-right: 1rem;
    font-size: 20px;
    color: #2185d0;
    cursor: pointer;

    &:hover {
      background-color: #f1f1f1;
    }

    &.activated {
      i {
        border: 5px solid #cce6ff;
        border-radius: 50%;
      }
    }

    &.setting {
      position: relative;
    }
  }

  .setting-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-70%, calc(100% + 10px));
    width: 200px;
    padding: .5rem;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, .2);
    z-index: 2;

    &::before {
      position: absolute;
      top: 0;
      right: 52px;
      transform: translateY(calc(-100% + 1px));
      content: '';
      border: 8px solid transparent;
      border-bottom: 8px solid #fff;
      filter: drop-shadow(0 -3px 2px rgba(0, 0, 0, .2));
    }

    .setting-option {
      font-size: 1rem;
      padding: 5px 10px;
      color: #2c3e50;
      border-radius: 5px;
      position: relative;

      &:hover {
        background-color: #eee;
      }

      &:first-child {
        margin-bottom: 5px;

        &::after {
          position: absolute;
          bottom: -3px;
          left: 5px;
          content: '';
          width: calc(100% - 10px);
          border-bottom: 1px solid #ddd;
        }
      }
    }
  }
}
</style>
