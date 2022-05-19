<template>
  <div class="app-main">
    <Header v-on:logout="logout" :userFullName="userProfile.fullname"></Header>
    <section id="app-content">
      <LeftSideBar></LeftSideBar>
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
  components: { 
    Header,
    Footer,
    LeftSideBar
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
      logoutUser: "logoutUser",
    }),

    ...mapActions({
      getListFriends: 'getListFriends',
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
  },

  destroyed() {
    socket.off("connect_error")
    socket.off("new-message")
    socket.disconnect()
  }
};
</script>

<style lang="scss" scoped>
#app-content {
  min-height: calc(100vh - 58px - 80px - 0rem);
}
</style>
