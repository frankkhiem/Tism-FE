<template>
  <div class="contacts-page__header">
    <div class="page__title">
      Danh sách liên hệ
    </div>
    <div class="page__user">
      <div class="name">{{ user.fullname }}</div>
      <div class="email">{{ user.email }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'profile',
    }),
  },
}
</script>

<style lang="scss" scoped>
.contacts-page__header {
  text-align: center;
  height: 100px;
  background-color: #f4f5f7;
  padding-top: 1.3rem;

  .page__title {
    font-size: 30px;
    font-weight: 600;
    line-height: 1.4;
  }

  .page__user {
    div {
      display: inline-block;
    }

    .name {
      font-size: 20px;
      color: #0c3953;
      margin-right: .8rem;
    }

    .email {
      font-size: 14px;
      color: #0c3953;
    }
  }
}
</style>