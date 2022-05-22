<template>
  <sidebar-menu :menu="menu" :collapsed="true" width="200px" @toggle-collapse="onToggleCollapse"/>
</template>
<script>
export default {
   data() {
     return {
      collapsed: true,

      menu: [
        {
          href: '/',
          title: 'Home',
          icon: 'fa-solid fa-house-chimney'
        },
        {
          href: 'contacts',
          title: 'Contacts',
          icon: 'fa-solid fa-address-book'
        },
        {
          href: 'teams',
          title: 'Teams',
          icon: 'fa-solid fa-people-group'
        },
        {
          href: 'friends',
          title: 'Friend',
          icon: 'fa-solid fa-user-group'
        },
         {
          href: 'about',
          title: 'About Us',
          icon: 'fa-solid fa-circle-info'
        },
      ]
     };
  },

  methods: {
    onToggleCollapse() {
      this.$emit('toggle-collapse')
    },
  }
};
</script>
<style>
.v-sidebar-menu {
  background-color: #026aa7;
  top:58px;
  bottom: 80px;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
}

.v-sidebar-menu .vsm--mobile-bg {
  background-color: #1a9de9;
  z-index: 0;
}

.v-sidebar-menu .vsm--list {
  margin-top: 50px;
}
</style>
