<template>
  <div class="app-main">
    <Header></Header>
    <section id="app-content">
      <router-view></router-view>
    </section>
    <div>
      <h3>Footer</h3>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import Header from "./Header.vue";

export default {
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
  components: { Header },
};
</script>

<style scoped></style>
