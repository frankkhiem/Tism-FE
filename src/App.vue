<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {

    }
  },

  methods: {
    ...mapActions({
      fetchUserProfile: 'fetchUserProfile',
    }),
  },

  created() {
    this.fetchUserProfile();
  },
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}
</style>
