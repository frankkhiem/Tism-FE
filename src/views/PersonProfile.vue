<template>
  <div id="person-page">
    <div class="header-img">
      <img src="@/assets/img/headerbgmaing.gif" alt="">
    </div>
    <div v-if="loading" class="page-loading">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-else class="page-content">
      <div class="sub-content">
        <div class="avatar">
          <div 
            v-if="person.avatar" 
            class="img-avatar" 
            :class="{ online: person.status === 'online' }"
          >
            <img :src="person.avatar" alt="">
          </div>
          <div v-else class="text-avatar" :class="{ online: person.status === 'online' }">
            {{ person.firstNameLetter }}
          </div>
        </div>
        <div class="name">
          {{ person.name }}
        </div>
        <div class="email">
          {{ person.email }}
        </div>
        <div v-if="person.friendship === 'friend'" class="btns">
          <div class="friend-btn" @click="showUnFriend">
            <b-icon icon="person-check-fill"></b-icon>
            Bạn bè
            <div 
              v-if="unFriendBtn"
              v-click-outside-element="hideUnFriend"
              class="unfriend-btn"
              @click="unfriend"
            >
              <b-icon icon="person-dash-fill" class="unfriend-icon"></b-icon>
              Hủy kết bạn
            </div>
          </div>
          <div class="chat-btn" @click="toChat">
            <b-icon icon="chat-quote-fill"></b-icon>
            Nhắn tin
          </div>
        </div>
        <div v-if="person.friendship === 'stranger'" class="btns">
          <div class="chat-btn" @click="addFriend">
            <b-icon icon="person-plus-fill"></b-icon>
            Thêm bạn bè
          </div>
        </div>
        <div v-if="person.friendship === 'invitation sended'" class="btns">
          <div class="chat-btn" @click="cancelInvitation">
            <b-icon icon="person-x-fill"></b-icon>
            Hủy lời mời
          </div>
        </div>
        <div v-if="person.friendship === 'invitation received'" class="btns">
          <div class="friend-btn" @click="acceptInvitation">
            <!-- <b-icon icon="person-x-fill"></b-icon> -->
            Chấp nhận
          </div>
          <div class="chat-btn" @click="declineInvitation">
            <!-- <b-icon icon="person-x-fill"></b-icon> -->
            Từ chối
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="nav">
          <div 
            class="info-btn"
            :class="{ activated: infoType === 'personInfo' }"
            @click="redirect('PersonInfo')"
          >
            Thông tin cá nhân
          </div>
          <div
            class="mutual-friends-btn"
            :class="{ activated: infoType === 'mutualFriends' }"
            @click="redirect('MutualFriends')"
          >
            Bạn chung
            <span class="mutual-friends-badge">
              {{ person.mutualFriends }}
            </span>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      person: 'person'
    }),

    infoType: function() {
      if( this.$route.name === 'PersonInfo' ) return 'personInfo'
      if( this.$route.name === 'MutualFriends' ) return 'mutualFriends'
      return ''
    }
  },

  data() {
    return {
      unFriendBtn: false,
      loading: false
    }
  },

  methods: {
    ...mapActions({
      getPersonInfo: 'getPersonInfo',
      getMutualFriends: 'getMutualFriends',
      sendInvitationFriend: 'sendInvitationFriend',
      cancelInvitationFriend: 'cancelInvitationFriend',
      declineInvitationFriend: 'declineInvitationFriend',
      acceptInvitationFriend: 'acceptInvitationFriend',
      unFriend: 'unFriend'
    }),

    async refreshPerson() {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 500))
        await this.getPersonInfo(this.$route.params.personId)
        await this.getMutualFriends(this.$route.params.personId)
        this.loading = false
      } catch(error) {
        console.log(error);
      }
    },

    toChat() {
      this.$router.push({
        name: 'FriendChat',
        params: {
          chatRoomId: this.person.chatRoomId || 'unknown'
        }
      })
    },

    showUnFriend() {
      setTimeout(() => {
        this.unFriendBtn = true
      }, 0)
    },

    hideUnFriend() {
      setTimeout(() => {
        this.unFriendBtn = false
      }, 1)
    },

    unfriend() {
      this.hideUnFriend()
      this.$confirm(
        {
          title: `Hủy kết bạn với '${this.person.name}'`,
          message: `Bạn có chắc muốn xóa ${this.person.name} khỏi danh sách bạn bè không?`,
          button: {
            no: 'Hủy bỏ',
            yes: 'Xác nhận'
          },
          callback: async confirm => {
            if (confirm) {
              try {
                await this.unFriend(this.person.id)
                await this.refreshPerson()
              } catch(error) {
                console.log(error);
              }
            }
          }
        }
      )
    },

    async addFriend() {
      try {
        await this.sendInvitationFriend(this.person.id)
        await this.refreshPerson()
      } catch(error) {
        console.log(error);
      }
    },

    async acceptInvitation() {
      try {
        await this.acceptInvitationFriend(this.person.id)
        await this.refreshPerson()
      } catch(error) {
        console.log(error);
      }
    },

    async declineInvitation() {
      try {
        await this.declineInvitationFriend(this.person.id)
        await this.refreshPerson()
      } catch(error) {
        console.log(error);
      }
    },

    async cancelInvitation() {
      try {
        await this.cancelInvitationFriend(this.person.id)
        await this.refreshPerson()
      } catch(error) {
        console.log(error);
      }
    },

    redirect(routeName) {
      if( this.$route.name === routeName ) return
      this.$router.push({ name: routeName })
    },

    
  },

  created() {
    this.refreshPerson()
  },

  watch: {
    $route(to, from) {
      if( to.params.personId === from.params.personId ) return
      this.refreshPerson()
    }
  }
}
</script>

<style lang="scss" scoped>
#person-page {
  height: calc(100vh - 58px - 80px - 0rem);

  .header-img {
    height: 55px;

    img {
      height: 100%;
      object-position: -120px;
    }
  }

  .page-loading {
    height: calc(100% - 55px);
    display: grid;
    place-items: center;

    img {
      width: 100px;
      height: 100px;
    }
  }

  .page-content {
    height: calc(100% - 55px);
    display: flex;

    .sub-content {
      flex-basis: 360px;
      flex-shrink: 0;

      .avatar {
        position: relative;
        width: 220px;
        height: 190px;
        margin: 0 auto;
        cursor: default;

        &:hover {
          filter: brightness(95%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);
        }

        > div {
          position: absolute;
          top: -30px;
          width: 220px;
          height: 220px;
          border-radius: 50%;

          &.online::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            transform: translate(-45px, -7px);
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #31a24c;
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .text-avatar {
          display: grid;
          place-items: center;
          font-size: 5.5rem;
          font-weight: 700;
          color: #fff;
          background-color: #ccc;
          user-select: none;
        }
      }

      .name {
        margin-top: 1rem;
        font-size: 30px;
        line-height: 40px;
        font-weight: 600;
        color: #050505;
        text-align: center;
        cursor: text;
      }

      .email {
        text-align: center;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2.5rem;

        > div {
          padding: 5px 20px;
          border-radius: 6px;
          margin: 0 .6rem;
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
            bottom: 0;
            left: 0;
            height: 34px;
            line-height: 34px;
            width: 140px;
            transform: translate(-10%, 165%);
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
              top: 0;
              left: 50%;
              transform: translate(-50%, -90%);
              border: 12px solid transparent;
              border-bottom: 12px solid #fff;
              filter: drop-shadow(0px -4px 2px rgba(0, 0, 0, 0.1));
            }

            &:hover {
              color: #fff;
              background-color: #ed5f0b;

              &::after {
                border-bottom: 12px solid #ed5f0b;
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

    .main-content {
      flex-grow: 1;
      // background-color: blue;
      overflow-y: auto;
      
      .nav {
        margin-top: 1.5rem;
        padding: 0 2rem;

        > div {
          margin-right: 20px;
          padding: 2px 1rem;
          background-color: #fff;
          // border: 1px solid #aaa;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0px 1px 3px 1px rgba(9, 30, 66, .25);
          cursor: pointer;
          transition: all .1s linear;
          user-select: none;

          &:hover {
            background-color: #f4f5fd;
          }

          &.activated {
            color: #fff;
            background-color: #047dc4;
          }
        }

        .mutual-friends-btn {
          padding-right: 12px;

          .mutual-friends-badge {
            display: inline-block;
            margin-left: 4px;
            min-width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            font-size: 12px;
            color: #fff;
            background-color: #ef5210;
            border-radius: 4px;
            padding: 0 3px;
          }
        }
      }
    }
  }
}
</style>
