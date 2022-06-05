<template>
  <div class="conversation-info">
    <div class="avatar">
      <img v-if="conversation.friendAvatar" :src="conversation.friendAvatar" alt="">
      <div v-else class="avatar-text">
        {{ conversation.friendFirstNameLetter }}
      </div>
    </div>
    <div class="friend-name">
      {{ conversation.friendFullName }}
    </div>
    <div class="action-btn profile-btn" @click="toProfile">
      <i class="fa-solid fa-user-check"></i>
      Trang cá nhân
    </div>
    <div class="action-btn about-us-btn" @click="toAboutUs">
      <i class="fa-solid fa-circle-question"></i>
      Thông tin ứng dụng
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conversation: {
      type: Object
    }
  },

  methods: {
    toProfile() {
      this.$router.push({
        name: 'PersonInfo',
        params: {
          personId: this.conversation.friendId
        }
      })
    },

    toAboutUs() {
      this.$router.push({ name: 'About' })
    }
  }
}
</script>

<style lang="scss" scoped>
.conversation-info {
  padding: 2rem;
  margin-top: .5rem;
  height: calc(100% - 60px);

  .avatar {
    width: 120px;
    height: 120px;
    position: relative;
    margin: 1rem auto .5rem;

    &-text {
      width: inherit;
      height: inherit;
      line-height: 120px;
      border-radius: 50%;
      text-align: center;
      font-size: 56px;
      font-weight: 700;
      color: #fff;
      background-color: #ccc;
    }

    img {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .friend-name {
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    color: #050505;
    margin-bottom: 1.3rem;
  }

  .action-btn {
    width: fit-content;
    margin: 1.2rem auto;
    padding: 5px 16px;
    background-color: #e4e6eb;
    border-radius: 6px;
    box-shadow: 0 0 6px 0px rgba(0, 0, 0, .4);
    cursor: pointer;

    &:hover {
      background-color: #dbdbeb;
    }

    i {
      margin-right: 2px;
    }
  }
}
</style>
