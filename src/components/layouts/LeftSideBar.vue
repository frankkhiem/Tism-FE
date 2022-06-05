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
          href: { path: '/' },
          title: 'Trang chủ',
          icon: 'fa-solid fa-house-chimney'
        },
        {
         href: { path: '/contacts' },
          title: 'Liên hệ',
          icon: 'fa-solid fa-address-book'
        },
        {
          href: { path: '/friends' },
          title: 'Bạn bè',
          icon: 'fa-solid fa-user-group'
        },
        {
          href: { path: '/teams' },
          title: 'Nhóm',
          icon: 'fa-solid fa-table-columns'
        },
        {
          href: { path: '/about' },
          title: 'Giới thiệu',
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
  background-color: #f2f4f7;
  top:58px;
  bottom: 80px;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  color: black;
  background-color: transparent;
}

.v-sidebar-menu .vsm--mobile-bg {
  background-color: #616c73;
  z-index: 0;
}

.v-sidebar-menu .vsm--list {
  margin-top: 50px;
}

.v-sidebar-menu .vsm--toggle-btn {
  background-color: #bbc5d6;
  color: black;
}

.v-sidebar-menu .vsm--toggle-btn::after {
  content: '\f03a';
}

.v-sidebar-menu .vsm--title {
  color: black;
}

.v-sidebar-menu .vsm--link_mobile-item .vsm--title {
  color: #f2f4f7;
}
</style>
