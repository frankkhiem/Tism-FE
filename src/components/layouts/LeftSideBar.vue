<template>
  <sidebar-menu :menu="menu" :collapsed="true" width="200px"/>
</template>
<script>
export default {
   data() {
     return {
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
          title: 'About We',
          icon: 'fa-solid fa-circle-info'
        },
      ]
     };
  },
};
</script>
<style>
.v-sidebar-menu {
  /* top: 58px;
  bottom: 60px; */
  position: absolute;
  top: 58px;
  background-color: #026aa7;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
}

.v-sidebar-menu .vsm--mobile-bg {
  background-color: #1a9de9;
  z-index: 0;
}
</style>
