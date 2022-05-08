<template>
  <div class="header">
    <sui-menu
      inverted
      v-bind:style="{
        padding: '0.5rem',
        backgroundColor: '#026AA7',
        display: 'flex',
        height: 54,
        zIndex: 1000,
        borderRadius: 0,
      }"
    >
      <div class="top-nav-left">
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="th"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="home"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/contacts" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="trello"
            content="Trello boards"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          ></sui-icon>
        </router-link>
        <sui-input
          inverted
          color="blue"
          fitted="true"
          icon="blue search circular fitted inverted link icon"
        ></sui-input>
      </div>
      <router-link to="/" class="home-link">
        <div class="home-link-div">
          <span class="home-link-gif"></span>
          <span class="home-link-img"></span>
        </div>
      </router-link>
      <div 
        class="top-nav-right" 
        :style="{
          height: '42px'
        }"
      >
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="plus"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="info"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
        </router-link>
        <router-link to="/" class="top-nav-links">
          <sui-icon
            bordered
            fitted
            name="bell outline"
            inverted
            color="blue"
            :style="{
              borderRadius: '2px',
              margin: '2px',
              height: '42px',
              width: '42px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '4px',
            }"
          ></sui-icon>
        </router-link>
        <div class="dropdown-menu-account">
          <p
            :style="{
              borderRadius: '50%',
              height: '42px',
              width: '42px',
              userSelect: 'none',
            }"
            @click="show_dropdown_menu = !show_dropdown_menu"
          >
            <sui-icon
              name="user"
              size="large"
              v-show="!userFullName"
              :style="{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '4px',
              }"
            >
            </sui-icon>
            <span class="user-name" v-show="userFullName">{{ userFullName.split(' ').map(elem => elem[0]).join('').slice(0, 2) }}</span>
          </p>
          <div class="dot online"></div>
          <div class="menu-options" v-show="show_dropdown_menu == true">
            <div class="option" v-for="(option, index) in options" :key="index">
              <div v-if="index !== options.length - 1">
                <i aria-hidden="true" class="icon" :class="option.icon"></i>
                <span class="text">{{ option.text }}</span>
              </div>
              <div v-else @click="logout">
                <i aria-hidden="true" class="icon" :class="option.icon"></i>
                <span class="text">{{ option.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </sui-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_dropdown_menu: false,
      options: [
        { key: "user", text: "Account", icon: "user", value: "user" },
        {
          key: "settings",
          text: "Settings",
          icon: "settings",
          value: "settings",
        },
        {
          key: "sign-out",
          text: "Sign Out",
          icon: "sign out",
          value: "sign-out",
        },
      ],
    };
  },

  props: {
    userFullName: String
  },

  methods: {
    logout() {
      this.$emit('logout')
    }
  }
};
</script>

<style scoped>
.top-nav-left {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}
.top-nav-left .top-nav-links {
  margin-right: 4px;
}
.top-nav-left .input {
  height: 42px;
}
.top-nav-right {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  overflow: visible;
}
.top-nav-right .top-nav-links {
  margin-right: 4px;
}
.top-nav-right p {
  align-items: center;
  background-color: #dfe1e6;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  border: 0;
  border-radius: 100%;
  box-sizing: border-box;
  color: #172b4d;
  display: inline-flex;
  font-size: 16px;
  font-weight: 700;
  justify-content: center;
  line-height: 40px;
  opacity: 1;
  height: 42px;
  width: 42px;
  overflow: hidden;
  white-space: nowrap;
}
.home-link {
  display: block;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  top: 5px;
}
.home-link .home-link-img {
  background-image: url("./../../assets/img/header-logo-2x.01ef898811a879595cea.png");
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 120px 42px;
  cursor: pointer;
  display: inline-block;
  height: 42px;
  width: 120px;
}
.home-link .home-link-gif {
  background-image: url("./../../assets/img/header-loading-logo.d73159084f5122775d4d.gif");
  background-size: 18px 18px;
  display: inline-block;
  opacity: 0;
  height: 18px;
  right: 59px;
  position: absolute;
  top: 6px;
  width: 18px;
}

.dropdown-menu-account {
  cursor: pointer;
  position: relative;
}

.menu-options {
  position: absolute;
  top: 60px;
  right: 5px;
  background: #fff;
  font-size: 1em;
  text-shadow: none;
  text-align: left;
  box-shadow: 0 2px 3px 0 rgb(34 36 38 / 15%);
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.28571429rem;
  transition: opacity 0.1s ease;
  z-index: 11;
  will-change: transform, opacity;
  width: 120px
}

.menu-options::after {
  top: -0.25em;
  left: auto !important;
  right: 1em !important;
  margin: 0;
  transform: rotate(45deg);
  display: block;
  position: absolute;
  pointer-events: none;
  content: "";
  visibility: visible;
  transform: rotate(45deg);
  width: 0.5em;
  height: 0.5em;
  box-shadow: -1px -1px 0 0 rgb(34 36 38 / 15%);
  background: #fff;
  z-index: 2;
}

.menu-options > .option {
  margin: 0;
  text-align: left;
  font-size: 1em !important;
  background: 0 0 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  text-transform: none !important;
  font-weight: 400 !important;
  box-shadow: none !important;
  transition: none !important;
}

.menu-options > .option > div {
  padding: 11px 16px !important;
}

.menu-options > .option:hover {
  background: rgba(0, 0, 0, 0.05) !important;
  color: rgba(0, 0, 0, 0.95) !important;
}

.user-name {
  text-transform: uppercase;
}

.dot {
    height: 12px;
    width: 12px;
    border-radius: 100%;
    position: absolute;
    top: 32px;
    right: 1px;
    display: none;
}

.dot.online {
  background: #31a24c;
  display: block;
}

.dot.busy {
  background: #ed4646;
  display: block;
}
</style>
