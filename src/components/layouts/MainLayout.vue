<template>
  <div class="app-main">
    <div class="header">
      <h1>Header</h1>
      <div @click="logout">Đăng xuất</div>
    </div>
    <section id="app-content">
      <router-view></router-view>
    </section>
    <div>
      <h3>Footer</h3>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'

export default {
  computed: {
    ...mapGetters({
      isAuth: 'userAuthenticated',
      userProfile: 'profile',
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout( () => {
        if( !vm.isAuth ) next({ name: 'Login' })
        else next()
      }, 200)
    })
  },

  methods: {
    ...mapMutations({
      logoutUser: 'logoutUser'
    }),

    async logout() {
      try {
        const accessToken = localStorage.getItem('accessToken')

        await axios.post(`${process.env.VUE_APP_API_HOST}/logout`, {}, { 
          headers: {"Authorization" : `Bearer ${accessToken}`} 
        })
      } catch(error) {
        // statements
        // console.log(error)
      }
      
      this.logoutUser()
      this.$router.push({name: 'Login'})
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header h1 {
  margin-left: 2rem;
}
.header div {
  margin-right: 2rem;
  cursor: pointer;
}
</style>