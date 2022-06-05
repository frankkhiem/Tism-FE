<template>
  <div class="list-header">
    <div class="group">#</div>
    <div class="contact-name">Tên liên hệ</div>
    <div class="contact-numbers">Số điện thoại</div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.list-header {
  display: flex;
  margin-top: 1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #dfe1e6;

  .group {
    margin-left: 2.5rem;
  }

  .contact-name {
    margin-left: 5rem;
  }

  .contact-numbers {
    margin-left: 14rem;
  }
}
</style>