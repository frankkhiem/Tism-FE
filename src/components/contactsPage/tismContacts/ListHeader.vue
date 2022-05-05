<template>
  <div class="list-header">
    <div class="checkbox-all">
      <input v-if="contactsCount" type="checkbox" v-model="checkAll">
      <input v-else type="checkbox" v-model="checkAll" disabled>
    </div>
    <div class="group">#</div>
    <div class="contact-name">Tên liên hệ</div>
    <div class="contact-numbers">Số điện thoại</div>
    <div class="contact-actions">Hành động</div>
  </div>
</template>

<script>
export default {
  props: {
    checkedAll: Boolean,
    contactsCount: Number
  },

  computed: {
    checkAll: {
      get: function() {
        return this.checkedAll
      },

      set: function(checked) {
        this.$emit('check-all-change', checked)
      }
    }
  },

  data() {
    return {

    }
  },

  methods: {
    
  },

  watch: {
    
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  display: flex;
  margin-top: 1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #dfe1e6;

  .checkbox-all {
    margin-left: 2.5rem;

    input {
      cursor: pointer;

      &[disabled] {
        cursor: default;
      }
    }
  }

  .group {
    margin-left: 2.5rem;
  }

  .contact-name {
    margin-left: 5rem;
  }

  .contact-numbers {
    margin-left: 10rem;
  }

  .contact-actions {
    margin-left: 8rem;
  }
}
</style>