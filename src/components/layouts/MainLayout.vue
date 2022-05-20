<template>
  <div class="app-main">
    <Header v-on:logout="logout" :userFullName="userProfile.fullname"></Header>
    <section id="app-content" :class="{'collapedContent': collapedContent }">
      <LeftSideBar v-on:toggle-collapse="toggleCollapse"></LeftSideBar>
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

    toggleCollapse () {
      this.collapedContent = !this.collapedContent
    }
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
}

.collapedContent {
  padding-left: 0px !important;
}
</style>
