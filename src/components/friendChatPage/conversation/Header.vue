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
        <div v-else class="friend-status">
          <span class="offline-badge"></span>
          Offline
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
      <div class="action-btn">
        <i class="fa-solid fa-gear"></i>
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

import { mapGetters } from 'vuex'
// import axios from 'axios'
import socket from '@/helpers/socketClient'

export default {
  props: {
    conversation: {
      type: Object
    }
  },

  computed: {
    ...mapGetters({
      user: 'profile'
    })
  },

  data() {
    return {
      showInfo: false,
      friendStatus: 'offline',
      realtimeOnline: false,
      friendAccept: null
    }
  },

  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo
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
          setConnected: this.setCallConnected
        },
        {
          width: '500px',
          height: '150px'
        },
        {
          'closed': this.checkCanceledCall
        }
      )
    },

    checkCanceledCall() {
      // console.log(this.friendAccept)
      if( this.friendAccept === null ) {
        socket.emit('cancel-video-call', {
          caller: this.user.userId,
          callerName: this.user.fullname,
          receiver: this.conversation.friendId
        })
      }
    },

    setCallConnected(connected) {
      this.friendAccept = connected
    },

    startCall() {
      this.$modal.show(
        VideoCallModal,
        { 
          conversation: this.conversation
        },
        {
          width: '100%',
          height: '100%'
        },
        {
          'closed': this.endCall
        }
      )
    },

    endCall() {
      socket.emit('end-video-call-from-caller', {
        caller: this.user.userId,
        callerName: this.user.fullname,
        receiver: this.conversation.friendId
      })
    },

    handleVideoCall() {
      if( !this.realtimeOnline ) {
        this.$confirm(
          {
            title: `Không thể gọi Video`,
            message: `📞 Người dùng này hiện đang offline, hãy thực hiện lại cuộc gọi sau 🟢.`,
            button: {
              no: 'Đã hiểu!'
            }          
          }
        )
        return
      }

      this.initialCall()
    }
  },

  created() {
    socket.on('friend-online', (data) => {
      if( data.id === this.conversation.friendId ) {
        this.friendStatus = 'online'
        this.realtimeOnline = true
      }
    })

    socket.on('friend-offline', (data) => {
      if( data.id === this.conversation.friendId ) {
        this.realtimeOnline = false
        setTimeout(() => {
          if( !this.realtimeOnline ) {
            this.friendStatus = 'offline'
          }
        }, 5000)
      }
    })
  },

  watch: {
    conversation(newData) {
      this.friendStatus = newData.friendStatus
      this.realtimeOnline = this.friendStatus === 'online' ? true : false
    },

    friendAccept(connected) {
      if( connected ) {
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
  }
}
</style>
