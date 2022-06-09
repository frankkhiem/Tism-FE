<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <router-view v-if="!loadingUser"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      loadingUser: false
    }
  },

  methods: {
    ...mapActions({
      fetchUserProfile: 'fetchUserProfile',
      getListFriends: 'getListFriends'
    }),
  },

  async created() {
    this.loadingUser = true
    await this.fetchUserProfile()
    // await this.getListFriends()
    this.loadingUser = false
  },
}
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
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
