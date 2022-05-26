<template>
  <div class="app-main">
    <Header 
      @logout="logout" 
      :userAvatar="userProfile.avatar"
      :userFirstName="userProfile.firstName"
      :userFirstNameLetter="userProfile.firstNameLetter"
    ></Header>
    <section id="app-content" :class="{'collapedContent': collapedContent }">
      <LeftSideBar v-on:toggle-collapse="toggleCollapse"></LeftSideBar>
      <router-view></router-view>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import IncomingCallModal from './globalModals/IncomingCallModal'
import ReceivedVideoCallModal from './globalModals/ReceivedVideoCallModal'

import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from "vuex"
import axios from "axios";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import LeftSideBar from "./LeftSideBar.vue";
import socket from "@/helpers/socketClient"
import createPeer from "@/helpers/peerClient"

export default {
  components: {
    Header,
    Footer,
    LeftSideBar,
  },

  computed: {
    ...mapGetters({
      isAuth: "userAuthenticated",
      userProfile: "profile",
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      setTimeout(() => {
        if (!vm.isAuth) next({ name: "Login" });
        else next();
      }, 200);
    });
  },

  data() {
    return {
      collapedContent: true,
      videoCallConnected: false,
      videoCallInfo: Object
    }
  },

  methods: {
    ...mapMutations({
      logoutUser: 'logoutUser',
      removeDeletedMessage: 'removeDeletedMessage'
    }),

    ...mapActions({
      getListFriends: 'getListFriends',
      getListConversations: 'getListConversations',
      playMessageSound: 'playMessageSound'
    }),

    async logout() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.post(
          `${process.env.VUE_APP_API_HOST}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } catch (error) {
        // statements
        // console.log(error)
      }
      this.logoutUser();
      this.$router.push({ name: "Login" });
    },

    toggleCollapse () {
      this.collapedContent = !this.collapedContent
    },

    showIncomingCallModal(callInfo) {
      this.$modal.show(
        IncomingCallModal,
        { 
          callInfo,
          setConnected: this.handleVideoCallConnect
        },
        {
          width: '500px',
          height: '140px',
          clickToClose: false
        },
        {
          'closed': this.checkVideoCallConnected
        }
      )
    },

    handleVideoCallConnect(connected) {
      this.videoCallConnected = connected
    },

    checkVideoCallConnected() {
      // console.log(this.videoCallConnected)
      if( this.videoCallConnected ) {
        this.startCall()
      }
    },

    startCall() {
      this.$modal.show(
        ReceivedVideoCallModal,
        { 
          callInfo: this.videoCallInfo
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
      // 
    }
  },

  async created() {
    if( this.isAuth ) {
      await this.getListFriends()

      // connect to socket server
      socket.auth = {
        userId: this.userProfile.userId
      }
      socket.connect()

      // connect to peer server
      Vue.prototype.$peer = createPeer(this.userProfile.userId)
    }

    socket.on('connect_error', (error) => {
      console.error('Connect to socket server fail: '+ error.message)
    });

    socket.on('new-message', () => {
      this.playMessageSound()
    });

    socket.on('deleted-message', (deletedMessage) => {
      this.removeDeletedMessage(deletedMessage)
      this.getListConversations()

    });

    socket.on('friend-online', async () => {
      this.getListFriends()
      this.getListConversations()
    });

    socket.on('friend-offline', async () => {
      await new Promise(resolve => setTimeout(resolve, 5000))
      this.getListFriends()
      this.getListConversations()
    });

    socket.on('incoming-video-call', (callInfo) => {
      this.showIncomingCallModal(callInfo)
      this.videoCallInfo = callInfo
    })
  },

  mounted() {
    console.log(this.userProfile.userId)
  },

  destroyed() {
    socket.off('connect_error')
    socket.off('new-message')
    socket.off('deleted-message')
    socket.off('friend-online')
    socket.off('friend-offline')
    socket.off('incoming-video-call')
    socket.disconnect()
  },
};
</script>

<style lang="scss" scoped>
#app-content {
  height: calc(100vh - 58px - 80px);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 150px;
  transition: 0.3s padding-left ease;
  margin-left: 50px;
}

.collapedContent {
  padding-left: 0px !important;
}
</style>
