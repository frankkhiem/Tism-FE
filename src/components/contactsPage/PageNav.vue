<template>
  <div class="contacts-page__nav">
    <div :class="{ actived: activedTism }" class="tism-contacts" @click="redirect('/contacts')">
      Danh bạ của bạn
    </div>
    <div :class="{ actived: activedGoogle }" class="google-contacts" @click="redirect('/contacts/google-contacts')">
      Google
    </div>
    <div :class="{ actived: activedOutlook }" class="outlook-contacts" @click="redirect('/contacts/outlook-contacts')">
      Outlook
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activedTism: false,
      activedGoogle: false,
      activedOutlook: false,
    }
  },

  methods: {
    redirect(path) {
      if( this.$route.path !== path ) this.$router.push(path)
    },

    activeNav(type) {
      switch (type) {
        case 'Contacts':
          this.activedTism = true
          this.activedGoogle = false
          this.activedOutlook = false
          break;
        case 'GoogleContacts':
          this.activedTism = false
          this.activedGoogle = true
          this.activedOutlook = false
          break;
        case 'OutlookContacts':
          this.activedTism = false
          this.activedGoogle = false
          this.activedOutlook = true
          break
        default:
          console.log('Có lỗi')
          break;
      }
    }
  },

  created() {
    this.activeNav(this.$route.name)
  },

  watch: {
    $route(to){
      this.activeNav(to.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-page__nav {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 50px;
  background-color: #f4f5f7;
  border-bottom: 1px solid #dfe1e6;

  div {
    position: relative;
    bottom: -1px;
    background-color: #dfe1e6;
    padding: 4px 32px;
    margin: 0 8px;
    border-radius: 3px 3px 0 0;
    border: 1px solid #dfe1e6;
    border-bottom: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: #c1c7d0;
    }

    &.actived {
      background-color: #fff;
      border-color: #dfe1e6;
      cursor: default;
    }
  }
}
</style>