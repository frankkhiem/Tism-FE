<template>
  <div class="header">
    <sui-menu
      inverted
      v-bind:style="{
        padding: '0.5rem',
        backgroundColor: '#026AA7',
        display: 'flex',
        height: 54,
        zIndex: 1000,
        borderRadius: 0,
      }"
    >
      <div class="top-nav-left">
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="home"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/contacts" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="address book"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/teams" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="columns"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <sui-input
          inverted
          color="blue"
          fitted="true"
          icon="blue search circular fitted inverted link icon"
        ></sui-input>
      </div>
      <router-link to="/" class="home-link">
        <div class="home-link-div">
          <span class="home-link-gif"></span>
          <span class="home-link-img"></span>
        </div>
      </router-link>
      <div 
        class="top-nav-right" 
        :style="{
          height: '42px'
        }"
      >
        <router-link 
          to="/chat"
          class="top-nav-links chat-btn"
          @click.native="hasNewMessages = false"
        >
          <sui-icon
            bordered
            fitted
            name="facebook messenger"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
          <div v-show="hasNewMessages" class="badge-icon"></div>
        </router-link>
        <router-link 
          to="/" 
          class="top-nav-links notification-btn" 
          is="span"
          @click="handleShowNotificationsMenu"
        >
          <sui-icon
            bordered
            fitted
            name="bell outline"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
          <div v-show="hasNewNotifications" class="badge-icon"></div>
          <div 
            v-if="showNotificationsMenu" 
            class="notification-menu"
            v-click-outside-element="handleHideNotificationsMenu"
          >
            <div class="menu-title">
              Thông báo
            </div>
            <div class="notification-list">
              <NotificationItem
                v-for="(notification, index) in notifications"
                :type="notification.type"
                :image="notification.image"
                :title="notification.title"
                :description="notification.description"
                :topHighlight="notification.topHighlight"
                :bottomHighlight="notification.bottomHighlight"
                :seen="notification.seen"
                :key="index"
                @click.native.stop="seenNotification(index)"
              ></NotificationItem>
            </div>
          </div>
        </router-link>
        <router-link to="/about" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="info"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
        </router-link>
        <div class="dropdown-menu-account"  @click="showDropdownMenu">
          <p
            :style="{
              borderRadius: '50%',
              height: '42px',
              width: '42px',
              userSelect: 'none',
              transform: 'translateX(-1px)',
            }"
          >
            <span class="user-name-icon" v-if="userAvatar">
              <img :src="userAvatar" alt="">
            </span>
            <span class="user-name-icon text" v-else>{{ userFirstNameLetter }}</span>
          </p>
          <span class="user-name">{{ userFirstName }}</span>
          <div 
            class="menu-options" 
            v-if="show_dropdown_menu == true"
            v-click-outside-element="hideDropdownMenu"
          >
            <div class="option" v-for="(option, index) in options" :key="index">
              <div v-if="index === 0" @click.stop="toProfile">
                <i aria-hidden="true" class="icon" :class="option.icon"></i>
                <span class="text">{{ option.text }}</span>
              </div>
              <div v-else-if="index !== options.length - 1">
                <i aria-hidden="true" class="icon" :class="option.icon"></i>
                <span class="text">{{ option.text }}</span>
              </div>
              <div v-else @click="logout">
                <i aria-hidden="true" class="icon" :class="option.icon"></i>
                <span class="text">{{ option.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </sui-menu>
  </div>
</template>

<script>
import socket from '@/helpers/socketClient'
import NotificationItem from './notificationsMenu/NotificationItem'

export default {
  components: {
    NotificationItem
  },

  data() {
    return {
      show_dropdown_menu: false,
      options: [
        { key: "user", text: "Account", icon: "user", value: "user" },
        {
          key: "settings",
          text: "Settings",
          icon: "settings",
          value: "settings",
        },
        {
          key: "sign-out",
          text: "Sign Out",
          icon: "sign out",
          value: "sign-out",
        },
      ],
      hasNewMessages: false,
      hasNewNotifications: false,
      showNotificationsMenu: false,
      notifications: [
        {
          type: 'team',
          image: null,
          title: 'Làm việc cùng Tism',
          description: 'Tạo nhóm của bạn hoặc tham gia vào nhóm làm việc.',
          topHighlight: null,
          bottomHighlight: null,
          seen: true,
          redirectTo: '/teams'
        },
        {
          type: 'info',
          image: null,
          title: 'Welcome to Tism',
          description: 'Chào mừng bạn đến với Tism. Chúng tôi hy vọng bạn sẽ có những trải nghiệm tuyệt vời cùng ứng dụng này!',
          topHighlight: null,
          bottomHighlight: null,
          seen: true,
          redirectTo: '/about'
        },
      ]
    };
  },

  props: {
    userAvatar: String,
    userFirstName: String,
    userFirstNameLetter: String
  },

  methods: {
    showDropdownMenu() {
      setTimeout(() => {
        this.show_dropdown_menu = true
      }, 0)
    },

    hideDropdownMenu() {
      setTimeout(() => {
        this.show_dropdown_menu = false
      }, 1)
    },

    logout() {
      this.$emit('logout')
    },

    toProfile() {
      this.show_dropdown_menu = false
      if( this.$route.name !== 'Profile' ) this.$router.push({ name: 'Profile' })
    },

    handleShowNotificationsMenu() {
      this.hasNewNotifications = false
      setTimeout(() => {
        this.showNotificationsMenu= true
      }, 0)
    },

    handleHideNotificationsMenu() {
      setTimeout(() => {
        this.showNotificationsMenu = false
      }, 1)
    },

    seenNotification(index) {
      if( !this.notifications[index].seen ) {
        this.notifications[index].seen = true
      }
      this.showNotificationsMenu = false
      if( this.$route.path === this.notifications[index].redirectTo ) {
        this.$emit('rerender')
      } else {
        this.$router.push(this.notifications[index].redirectTo)
      }
    }
  },

  created() {
    socket.on('new-message', () => {
      if( !(/\/chat.*/).test(this.$route.path) ) {
        this.hasNewMessages = true
      }
    })
    socket.on('new-friend', (data) => {
      this.hasNewNotifications = true
      const newNoti = {
        type: 'friend',
        image: data.newFriendAvatar,
        title: 'Bạn mới',
        description: 'đã chấp nhận lời mời kết bạn của bạn.',
        topHighlight: data.newFriend,
        bottomHighlight: null,
        seen: false,
        redirectTo: '/friends'
      }
      this.notifications.unshift(newNoti)
    })
    socket.on('new-invitation-friend', (data) => {
      this.hasNewNotifications = true
      const newNoti = {
        type: 'friend',
        image: data.inviterAvatar,
        title: 'Lời mời kết bạn',
        description: 'đã gửi lời mời kết bạn cho bạn.',
        topHighlight: data.inviter,
        bottomHighlight: null,
        seen: false,
        redirectTo: '/friends/invitations'
      }
      this.notifications.unshift(newNoti)
    })
    socket.on('new-invitation-team', (data) => {
      this.hasNewNotifications = true
      const newNoti = {
        type: 'team',
        image: data.inviterAvatar,
        title: 'Lời mời vào nhóm',
        description: 'đã gửi cho bạn lời mời vào nhóm',
        topHighlight: data.inviter,
        bottomHighlight: data.teamName,
        seen: false,
        redirectTo: '/teams'
      }
      this.notifications.unshift(newNoti)
    })
  },

  watch: {
    $route() {
      this.hideDropdownMenu()
    }
  }
};
</script>

<style scoped>
.top-nav-left {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}
.top-nav-links:hover {
  text-decoration: none;
}
.top-nav-links i:hover {
  filter: brightness(120%);
}
.top-nav-left .top-nav-links {
  margin-right: 4px;
}
.top-nav-left .input {
  height: 42px;
}
.top-nav-right {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  overflow: visible;
}
.top-nav-right .top-nav-links {
  margin-right: 4px;
}
.top-nav-links.chat-btn {
  position: relative;
}
.top-nav-links.notification-btn {
  position: relative;
  cursor: pointer;
}
.top-nav-links .badge-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  background: #fe2e1c;
  border-radius: 50%;
}
.notification-btn .notification-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 350px;
  height: 350px;
  transform: translate(-60%, 2rem);
  background-color: #fff;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 4px;
  box-shadow: 0 1px 3px 1px rgb(34 36 38 / 15%);
  z-index: 2;
  cursor: default;
}
.notification-btn .notification-menu::before {
  position: absolute;
  top: 0;
  left: 60%;
  transform: translate(-50%, calc(-50% - 1px)) rotate(45deg);
  content: "";
  width: 20px;
  height: 20px;
  background: #fff;
  border-top: 1px solid rgba(34, 36, 38, 0.15);
  border-left: 1px solid rgba(34, 36, 38, 0.15);
}
.notification-btn .notification-menu .menu-title {
  width: fit-content;
  margin: .5rem 1rem 1rem;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
.notification-btn .notification-menu .menu-title:hover {
  color: #2185d0;
}
.notification-menu .notification-list {
  height: calc(100% - 60px);
  overflow-y: auto;
}
.top-nav-right p {
  align-items: center;
  background-color: #dfe1e6;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  border: 0;
  border-radius: 100%;
  box-sizing: border-box;
  color: #172b4d;
  display: inline-flex;
  font-size: 16px;
  font-weight: 700;
  justify-content: center;
  line-height: 40px;
  opacity: 1;
  height: 42px;
  width: 42px;
  overflow: hidden;
  white-space: nowrap;
}
.home-link {
  display: block;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  top: 5px;
}
.home-link .home-link-img {
  background-image: url("./../../assets/img/tismlogo.png");
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 120px 42px;
  cursor: pointer;
  display: inline-block;
  height: 42px;
  width: 120px;
}
.home-link .home-link-gif {
  background-image: url("./../../assets/img/header-loading-logo.d73159084f5122775d4d.gif");
  background-size: 18px 18px;
  display: inline-block;
  opacity: 0;
  height: 18px;
  right: 59px;
  position: absolute;
  top: 6px;
  width: 18px;
}

.dropdown-menu-account {
  cursor: pointer;
  position: relative;
  left: 20px;

}

.dropdown-menu-account > p {
  position: relative;
  z-index: 2;
}

.menu-options {
  position: absolute;
  top: 60px;
  right: 30px;
  background: #fff;
  font-size: 1em;
  text-shadow: none;
  text-align: left;
  box-shadow: 0 2px 3px 0 rgb(34 36 38 / 15%);
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.28571429rem;
  transition: opacity 0.1s ease;
  z-index: 11;
  will-change: transform, opacity;
  width: 120px
}

.menu-options::after {
  top: -0.25em;
  left: 1.3rem !important;
  right: auto !important;
  margin: 0;
  transform: rotate(45deg);
  display: block;
  position: absolute;
  pointer-events: none;
  content: "";
  visibility: visible;
  transform: rotate(45deg);
  width: 0.5em;
  height: 0.5em;
  box-shadow: -1px -1px 0 0 rgb(34 36 38 / 15%);
  background: #fff;
  z-index: 2;
}

.menu-options > .option {
  margin: 0;
  text-align: left;
  font-size: 1em !important;
  background: 0 0 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  text-transform: none !important;
  font-weight: 400 !important;
  box-shadow: none !important;
  transition: none !important;
}

.menu-options > .option > div {
  padding: 11px 16px !important;
}

.menu-options > .option:hover {
  background: rgba(0, 0, 0, 0.05) !important;
  color: rgba(0, 0, 0, 0.95) !important;
}

.user-name-icon {
  height: 40px;
}

.user-name-icon.text {
  height: 39px;
  text-transform: uppercase;
}

.user-name-icon img {
  height: 45px;
  width: 45px;
  object-fit: cover;
  transform: translateY(-2px);
}

.user-name {
  padding: 12px 20px 11px 50px;
  border-radius: 20px;
  background: white;
  position: relative;
  right: 42px;
  font-weight: 700;
}

.user-name:hover {
  background: #f4f5f7;
}

.dot {
    height: 12px;
    width: 12px;
    border-radius: 100%;
    position: absolute;
    top: 32px;
    right: 1px;
    display: none;
}

.dot.online {
  background: #31a24c;
  display: block;
}

.dot.busy {
  background: #ed4646;
  display: block;
}
</style>
