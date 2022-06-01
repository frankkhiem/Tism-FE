<template>
  <div class="image-modal">
    <img :src="imageUrl" alt="">
    <a ref="imageUrlDownload" :href="imageUrlDownload" :style="{ display: 'none' }"></a>
    <div class="btns">
      <b-icon 
        id="download-btn-target"
        class="action-btn download-btn" 
        icon="download"
        @click="$refs.imageUrlDownload.click()"
      ></b-icon>
      <b-tooltip target="download-btn-target" triggers="hover">
        Tải xuống
      </b-tooltip>
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
    imageUrl: {
      type: String
    },

    imageUrlDownload: {
      type: String
    }
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
    top: 2rem;
    right: 1.5rem;

    .action-btn {
      width: 45px;
      height: 45px;
      border-radius: 10px;
      padding: 12px;
      background-color: #d2d2d2;
      color: #fff;
      cursor: pointer;
      margin-right: 1rem;
      transition: background-color .1s linear;

      &:hover {
        background-color: #b2b2b2;
      }
    }
  }
}
</style>
