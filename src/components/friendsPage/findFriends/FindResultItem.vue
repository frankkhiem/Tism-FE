<template>
  <div class="friend-item">
    <div v-if="friend.avatar" class="avatar avatar--img" @click="toProfile">
      <img :src="friend.avatar" alt="">
    </div>
    <div v-else class="avatar avatar--text" @click="toProfile">
      {{ friend.firstNameLetter }}
    </div>
    <div class="info">
      <div class="name" @click="toProfile">{{ friend.name }}</div>
      <div class="mutual" @click="toMutualFriends">
        {{ friend.mutualFriends }} bạn chung
      </div>
      <div class="history">
        {{ friendStatus }}
      </div>
    </div>
    <div class="btns">
      <div v-if="status === 'friend'" class="chat-btn" @click="toChat">
        <b-icon icon="chat-quote-fill"></b-icon>
        Nhắn tin
      </div>
      <div v-if="status === 'stranger'" class="chat-btn" @click="addFriend">
        <b-icon icon="person-plus-fill"></b-icon>
        Thêm bạn bè
      </div>
      <div
        v-if="status === 'invitation received'" 
        class="friend-btn"
        @click="acceptInvitation"
      >
        <!-- <b-icon icon="person-check-fill"></b-icon> -->
        Chấp nhận
      </div>
      <div 
        v-if="status === 'invitation received'" 
        class="chat-btn" 
        @click="declineInvitation"
      >
        <!-- <b-icon icon="person-x-fill"></b-icon> -->
        Từ chối
      </div>
      <div 
        v-if="status === 'invitation sended'" 
        class="chat-btn" 
        @click="cancelInvitation"
      >
        <b-icon icon="person-x-fill"></b-icon>
        Hủy lời mời
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    friend: Object
  },

  computed: {
    friendStatus: function() {
      if( this.status === 'friend' ) return 'Bạn bè'
      if( this.status === 'invitation received' ) return 'Đã nhận được yêu cầu kết bạn'
      if( this.status === 'invitation sended' ) return 'Đã gửi lời mời'
      return 'Người lạ'
    }
  },

  data() {
    return {
      unFriendBtn: false,
      status: ''
    }
  },

  methods: {
    ...mapActions({    
      sendInvitationFriend: 'sendInvitationFriend',
      cancelInvitationFriend: 'cancelInvitationFriend',
      declineInvitationFriend: 'declineInvitationFriend',
      acceptInvitationFriend: 'acceptInvitationFriend'
    }),

    toChat() {
      this.$router.push(`/chat/${this.friend.chatRoomId}`)
    },

    toProfile() {
      this.$router.push(`/person/${this.friend.id}/info`)
    },

    toMutualFriends() {
      this.$router.push(`/person/${this.friend.id}/mutual-friends`)
    },

    async addFriend() {
      this.status = 'invitation sended'
      await this.sendInvitationFriend(this.friend.id)
    },

    async acceptInvitation() {
      this.status = 'friend'
      await this.acceptInvitationFriend(this.friend.id)
    },

    async declineInvitation() {
      this.status = 'stranger'
      await this.declineInvitationFriend(this.friend.id)
    },

    cancelInvitation() {
      this.$confirm(
        {
          title: `Hủy lời mời kết bạn với '${this.friend.name}'`,
          message: `Bạn có chắc muốn thực hiện điều này không?`,
          button: {
            no: 'Hủy bỏ',
            yes: 'Xác nhận'
          },
          callback: async confirm => {
            if (confirm) {
              this.status = 'stranger'
              await this.cancelInvitationFriend(this.friend.id)
            }
          }
        }
      )
    }
  },

  created() {
    this.status = this.friend.friendship
  }
}
</script>

<style lang="scss" scoped>
.friend-item {
  display: flex;
  align-items: center;
  height: 120px;
  width: 70%;
  margin: 0 auto 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, .2);
  padding: 0 1rem;

  .avatar {
    width: 85px;
    height: 85px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      filter: brightness(90%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);
    }

    &.avatar--text {
      display: grid;
      place-items: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      background-color: #ccc;
      user-select: none;
    }

    &.avatar--img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
  }

  .info {
    flex-grow: 1;
    margin-left: 1rem;

    .name {
      position: relative;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2;
      color: #050505;
      cursor: pointer;
      width: fit-content;

      &:hover::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-bottom: 1px solid #2c3e50;
      }
    }

    .mutual {
      position: relative;
      font-size: 14px;
      line-height: 1;
      margin-top: 2px;
      cursor: pointer;
      width: fit-content;

      &:hover::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        border-bottom: 1px solid #2c3e50;
      }
    }

    .history {
      margin-top: 10px;
      cursor: default;
    }
  }

  .btns {
    display: flex;
    flex-wrap: wrap;
    margin-right: 1rem;

    > div {
      padding: 4px 12px;
      border-radius: 6px;
      margin-left: .6rem;
      cursor: pointer;
    }

    .friend-btn {
      position: relative;
      background-color: #1b74e4;
      color: #fff;

      &:hover {
        background-color: #1557e5;
      }

      .unfriend-btn {
        position: absolute;
        top: 0;
        left: 0;
        height: 32px;
        line-height: 32px;
        width: 140px;
        transform: translate(-18%, -155%);
        color: #2c3e50;;
        text-align: center;
        box-shadow: 0 3px 10px 3px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        background-color: #fff;

        .unfriend-icon {
          margin-right: 5px;
        }

        &::after {
          position: absolute;
          content: "";
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 99%);
          border: 10px solid transparent;
          border-top: 10px solid #fff;
          filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
        }

        &:hover {
          color: #fff;
          background-color: #ed5f0b;

          &::after {
            border-top: 10px solid #ed5f0b;
          }
        }
      }
    }

    .chat-btn {
      background-color: #e4e6eb;

      &:hover {
        background-color: #dbdbeb;
      }
    }
  }
}

@media (max-width: 1220px) {
  .friend-item {
    width: 85%;
  }
}
</style>