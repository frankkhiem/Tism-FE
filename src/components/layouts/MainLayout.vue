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
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import LeftSideBar from "./LeftSideBar.vue";

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
};
</script>

<style lang="scss" scoped>
#app-content {
  min-height: calc(100vh - 58px - 80px - 1rem);
}
</style>
