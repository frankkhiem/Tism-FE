<template>
  <div class="contacts-page__google">
    <div class="google__title">
      <div class="google__account">
        <span class="google__email">{{ google.account }} </span>
        <span>đã liên kết</span>
      </div>
      <div class="google__btns">
        <div 
          class="refresh-btn"
          @mouseenter="hoverRefresh = true"
          @mouseleave="hoverRefresh = false"
        >
          <b-icon v-if="hoverRefresh" icon="arrow-clockwise" animation="spin"></b-icon>
          <b-icon v-else icon="arrow-clockwise"></b-icon>
          Làm mới
        </div>
        <div 
          class="sync-btn"
          @mouseenter="hoverSync = true"
          @mouseleave="hoverSync = false"
        >
          <b-icon v-if="hoverSync" icon="arrow-repeat" animation="spin"></b-icon>
          <b-icon v-else icon="arrow-repeat"></b-icon>
          Đồng bộ ngược
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      google: 'googleContacts',
    }),
  },

  data() {
    return {
      hoverRefresh: false,
      hoverSync: false
    }
  },
}
</script>

<style lang="scss" scoped>
.contacts-page__google {
  width: 70%;
  margin: 0 auto;

  .google {
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem 3rem;
      background-color: #1a9de9;
      border-radius: 5px;
    }

    &__account {
      font-size: 12px;
      color: #fff;
    }

    &__email {
      font-size: 20px;
    }

    &__btns {
      display: flex;

      > div {
        padding: 4px 8px;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }

      .refresh-btn {
        background-color: #17c870;

        &:hover {
          background-color: #1fbb6d;
        }
      }

      .sync-btn {
        background-color: #2275bf;
        margin-left: 1rem;

        &:hover {
          background-color: #1b4fab;
        }
      }
    }
  }
}
</style>