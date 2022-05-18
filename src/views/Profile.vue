<template>
  <div id="profile-page">
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
            v-if="user.avatar" 
            class="img-avatar" 
            :class="{ online: user.status === 'online' }"
          >
            <img :src="user.avatar" alt="">
          </div>
          <div v-else class="text-avatar" :class="{ online: user.status === 'online' }">
            {{ user.firstNameLetter }}
          </div>
        </div>
        <div class="name">
          {{ user.fullname }}
        </div>
        <div class="email">
          {{ user.email }}
        </div>
        <div class="history">
          Tham gia vào {{ user.createdAt }}
        </div>
        <div class="updated">
          Cập nhật vào {{ user.lastUpdatedAt }}
        </div>
        <div class="btns">
          <div 
            class="edit-btn"
            :class="{ activated: infoType === 'editProfile' }"
            @click="redirect('EditProfile')"
          >
            <b-icon icon="pencil-square" class="icon"></b-icon>
            Chỉnh sửa hồ sơ
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="nav">
          <div 
            class="info-btn"
            :class="{ activated: infoType === 'profile' }"
            @click="redirect('Profile')"
          >
            Thông tin cá nhân
          </div>
          <div
            class="list-friends-btn"
            @click="toListFriends"
          >
            Danh sách bạn bè
            <span class="list-friends-badge">
              {{ user.countFriends }}
            </span>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'profile'
    }),

    infoType: function() {
      if( this.$route.name === 'Profile' ) return 'profile'
      if( this.$route.name === 'EditProfile' ) return 'editProfile'
      return ''
    }
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    toListFriends() {
      this.$router.push({ name: 'ListFriends' })
    },

    redirect(routeName) {
      if( this.$route.name !== routeName ) this.$router.push({ name: routeName })
    }
  },

  async created() {
    this.loading = true
    await new Promise(resolve => setTimeout(resolve, 200))
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
#profile-page {
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
        margin-bottom: 6px;

        &:hover {
          text-decoration: underline;
        }

      }

      .history, .updated {
        text-align: center;
      }

      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;

        > div {
          padding: 6px 24px;
          border-radius: 6px;
          margin: 0 .6rem;
          cursor: pointer;
          transition: all .1s linear;
        }

        .friend-btn {
          position: relative;
          background-color: #1b74e4;
          color: #fff;

          &:hover {
            background-color: #1557e5;
          }
        }

        .edit-btn {
          background-color: #e4e6eb;

          &:hover {
            background-color: #dbdbeb;
          }

          &.activated {
            color: #fff;
            background-color: #1557e5;
          }

          .icon {
            margin-right: 6px;
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

        .list-friends-btn {
          padding-right: 12px;

          .list-friends-badge {
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
