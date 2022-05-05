<template>
  <div class="tism__title">
    <div class="tism__actions">
      <div 
        class="create-btn"
        @mouseenter="hoverCreate = true"
        @mouseleave="hoverCreate = false"
        @click="createContact"
      >
        <b-icon v-if="hoverCreate" icon="telephone-plus" scale="1"></b-icon>
        <b-icon v-else icon="telephone-plus" scale="0.9"></b-icon>
        Thêm liên hệ
      </div>
      <div 
        v-if="checkedNames.length"
        class="multiple-delete-btn"
        @mouseenter="hoverMultipleDelete = true"
        @mouseleave="hoverMultipleDelete = false"
        @click="multipleDelete"
      >
        <b-icon v-if="hoverMultipleDelete" icon="trash" scale="1"></b-icon>
        <b-icon v-else icon="trash" scale="0.8"></b-icon>
        Xóa ({{ checkedNames.length }})
      </div>
    </div>
    <div class="tism__btns">
      <div 
        class="refresh-btn"
        @mouseenter="hoverRefresh = true"
        @mouseleave="hoverRefresh = false"
        @click="$emit('tism-refresh')"
      >
        <b-icon v-if="hoverRefresh" icon="arrow-clockwise" animation="spin"></b-icon>
        <b-icon v-else icon="arrow-clockwise"></b-icon>
        Làm mới
      </div>
      <div 
        class="sync-btn"
        @mouseenter="hoverSync = true"
        @mouseleave="hoverSync = false"
        @click="$emit('tism-sync')"
      >
        <b-icon v-if="hoverSync" icon="arrow-repeat" animation="spin"></b-icon>
        <b-icon v-else icon="arrow-repeat"></b-icon>
        Đồng bộ
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    checkedNames: Array
  },

  data() {
    return {
      hoverCreate: false,
      hoverMultipleDelete: false,
      hoverRefresh: false,
      hoverSync: false
    }
  },

  methods: {
    ...mapActions({
      deleteMultipleContacts: 'deleteMultipleContacts'
    }),

    createContact() {
      this.$emit('create-contact')
    },

    multipleDelete() {
      this.$confirm(
        {
          title: `Xóa ${this.checkedNames.length} liên hệ`,
          message: `Bạn muốn xóa những liên hệ đã chọn?`,
          button: {
            no: 'Hủy',
            yes: 'Xóa'
          },
          callback: async confirm => {
            if (confirm) {
              await this.deleteMultipleContacts(this.checkedNames)
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.tism {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding: 1rem 3rem;
    background-color: #1a9de9;
    border-radius: 5px;
  }

  &__actions {
    display: flex;

    > div {
      padding: 4px 10px;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    .create-btn {
      background-color: #248398;

      &:hover {
        background-color: #167084;
      }
    }

    .multiple-delete-btn {
      background-color: #f94912;
      margin-left: 1rem;

      &:hover {
        background-color: #f70505;
      }
    }
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