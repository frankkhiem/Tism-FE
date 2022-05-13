<template>
  <div class="mutual-friends">
    <div v-if="mutualFriends.length" class="mutual">
      <MutualFriendItem
        v-for="(friend, index) in mutualFriends"
        :key="index"
        :friend="friend"
      ></MutualFriendItem>
    </div>
    <div v-else class="unmutual">
      Không có người bạn chung nào!
    </div>
  </div>
</template>

<script>
import MutualFriendItem from './MutualFriendItem'
import { mapGetters } from 'vuex'

export default {
  components: {
    MutualFriendItem
  },

  computed: {
    ...mapGetters({
      mutualFriends: 'listMutualFriends'
    })
  },
}
</script>

<style lang="scss" scoped>
.mutual-friends {
  margin-top: 3rem;
  padding: 0 2rem 3rem;

  .unmutual {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
