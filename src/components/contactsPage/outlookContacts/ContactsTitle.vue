<template>
  <div class="outlook__title">
    <div v-if="email" class="outlook__account">
      <span class="outlook__email">{{ email }} </span>
      <span>đã liên kết</span>
    </div>
    <div v-else class="outlook__account--unlinked">
      <b-icon icon="exclamation-octagon-fill" variant="warning"></b-icon> 
      <span>Chưa có kết nối Outlook</span>
    </div>
    <div class="outlook__btns">
      <div 
        class="refresh-btn"
        @mouseenter="hoverRefresh = true"
        @mouseleave="hoverRefresh = false"
        @click="$emit('outlook-refresh')"
      >
        <b-icon v-if="hoverRefresh" icon="arrow-clockwise" animation="spin"></b-icon>
        <b-icon v-else icon="arrow-clockwise"></b-icon>
        Làm mới
      </div>
      <div 
        class="sync-btn"
        @mouseenter="hoverSync = true"
        @mouseleave="hoverSync = false"
        @click="$emit('outlook-sync')"
      >
        <b-icon v-if="hoverSync" icon="arrow-repeat" animation="spin"></b-icon>
        <b-icon v-else icon="arrow-repeat"></b-icon>
        Đồng bộ ngược
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: String
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
.outlook {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding: 1rem 3rem;
    background-color: #1a9de9;
    border-radius: 5px;
  }

  &__account {
    font-size: 12px;
    color: #fff;

    &--unlinked {
      font-size: 16px;
      color: #fff;

      span {
        margin-left: 8px;
      }
    }
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
</style>