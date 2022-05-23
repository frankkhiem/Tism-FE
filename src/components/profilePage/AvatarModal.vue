<template>
  <div class="image-modal">
    <img :src="avatarUrl" alt="">
    <div class="btns">
      <b-icon 
        id="close-btn-target"
        class="action-btn close-btn" 
        icon="x-circle"
        @click="$emit('close')"
      ></b-icon>
      <b-tooltip target="close-btn-target" triggers="hover">
        Đóng!
      </b-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: String
  }
}
</script>

<style lang="scss" scoped>
.image-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  position: relative;

  img {
    width: 95%;
    height: 95%;
    object-fit: contain;
  }

  .btns {
    position: absolute;
    top: .8rem;
    right: 1rem;

    .action-btn {
      width: 45px;
      height: 45px;
      border-radius: 10px;
      padding: 12px;
      background-color: #d2d2d2;
      color: #fff;
      cursor: pointer;
      transition: background-color .1s linear;

      &:hover {
        background-color: #b2b2b2;
      }
    }
  }
}
</style>
