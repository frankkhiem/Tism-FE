<template>
  <div class="outlook__search">
    <div class="search-form">
      <input v-model="keyword" @input="search" type="text" placeholder="Tìm liên hệ">
      <b-icon class="search-btn" @click="search" icon="search"></b-icon>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: ''
    }
  },

  methods: {
    search() {
      this.$emit('search-contacts', this.keyword)
    }
  }
}
</script>

<style lang="scss" scoped>
.outlook__search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;

  .search-form {
    position: relative;

    input {
      width: 260px;
      padding: 4px 36px 4px 10px;
      font-size: 14px;
      border: 1px solid #b1b4bd;
      border-radius: 5px;
      outline: none;

      &:focus {
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
      }
    }

    .search-btn {
      position: absolute;
      right: 0;
      top: 50%;
      height: 100%;
      width: 36px;
      padding: 0 10px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
}
</style>