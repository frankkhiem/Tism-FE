<template>
  <div class="contacts-info">
    <div class="contacts-count">
      Có {{ contactsCount }} liên hệ
    </div>
    <div v-if="contactsSyncAt" class="contacts-sync-at">
      Đồng bộ lần cuối vào {{ syncAt }}
    </div>
    <div v-else class="contacts-sync-at">
      Danh bạ chưa từng được đồng bộ
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contactsCount: Number,
    contactsSyncAt: String
  },
  data() {
    return {
      syncAt: ''
    }
  },

  created() {
    if( this.contactsSyncAt ) this.syncAt = new Date(this.contactsSyncAt).toLocaleString()
  },

  watch: {
    contactsSyncAt(newValue) {
      this.syncAt = new Date(newValue).toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-info {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  div {
    margin-left: 1rem;
  }
}
</style>