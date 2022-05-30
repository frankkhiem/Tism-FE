<template>
  <div id="add-new-team-modal">
    <div
      class="modal-close"
      @click="$emit('close')"
      @mouseenter="hoverClose = true"
      @mouseleave="hoverClose = false"
    >
      <b-icon
        v-if="hoverClose"
        icon="x"
        class="border border-danger rounded"
        variant="danger"
        scale="1.2"
      ></b-icon>
      <b-icon
        v-else
        icon="x"
        class="border border-danger rounded"
        variant="danger"
      ></b-icon>
    </div>
    <div class="modal-title">
      <div>
        Mời thêm thành viên
      </div>
    </div>
    <div class="modal-main">
      Content
    </div>
    <div class="modal-btns">
      <div class="cancel-btn"  @click="$emit('close')">
        Hủy
      </div>
      <div class="agree-btn">
        Tạo
      </div>
    </div>
  </div>
</template>
 
<script>
 
export default {
  props: {
    isUpdate: Boolean,
  },
 
  data() {
    return {
      hoverClose: false,
    }
  },
}
</script>
 
<style lang="scss" scoped>
#add-new-team-modal {
  position: relative;
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;
 
  .modal-close {
    position: absolute;
    top: 0;
    right: .5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }
 
  .modal-title {
    font-size: 20px;
    font-weight: 600;
    padding: 10px 1.5rem;
    border-bottom: 1px solid #ddd;
  }
 
  .modal-main {
    margin-top: 1rem;
    padding: 0 1.5rem;
  }
 
  .modal-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    margin-bottom: 14px;
    padding: 0 1.5rem;
 
    div {
      padding: 4px 12px;
      border-radius: 5px;
      cursor: pointer;
    }
 
    .cancel-btn:hover {
      background-color: #85dadf2f;
    }
 
    .agree-btn {
      margin-left: .3rem;
      color: #fff;
      background-color: #4bcb50;
 
      &:hover {
        background-color: #46b04a;
      }
    }
  }
}
</style>
