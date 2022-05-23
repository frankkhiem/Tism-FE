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
import { mapGetters, mapMutations, mapActions } from "vuex";
import axios from "axios";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import LeftSideBar from "./LeftSideBar.vue";
import socket from "@/helpers/socketClient"

export default {
  data() {
    return {
      collapedContent: true
    };
  },

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
    }
  },

  async created() {
    await this.getListFriends()
    if( this.isAuth ) {
      socket.auth = {
        userId: this.userProfile.userId
      }
      socket.connect()
    }

    socket.on("connect_error", (error) => {
      console.error('Connect to socket server fail: '+ error.message)
    });

    socket.on("new-message", () => {
      this.playMessageSound()
    });

    socket.on("deleted-message", (deletedMessage) => {
      this.removeDeletedMessage(deletedMessage)
      this.getListConversations()

    });

    socket.on("friend-online", async () => {
      this.getListFriends()
      this.getListConversations()
    });

    socket.on("friend-offline", async () => {
      await new Promise(resolve => setTimeout(resolve, 5000))
      this.getListFriends()
      this.getListConversations()
    });
  },

  destroyed() {
    socket.off("connect_error")
    socket.off("new-message")
    socket.off("deleted-message")
    socket.off("friend-online")
    socket.off("friend-offline")
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
