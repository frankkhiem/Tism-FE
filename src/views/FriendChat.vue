<template>
  <div v-if="loading" class="page-loading">
    <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
  </div>
  <div v-else id="friend-chat-page">
    <SubSidebar></SubSidebar>
    <Conversation v-if="inConversation"></Conversation>
    <div v-else class="out-conversation">
      Hãy chọn cuộc trò chuyện của bạn!
    </div>
  </div>
</template>

<script>
import SubSidebar from '@/components/friendChatPage/subSidebar/SubSidebar'
import Conversation from '@/components/friendChatPage/conversation/Conversation'

import { mapActions } from 'vuex'
import socket from '@/helpers/socketClient'

export default {
  components: {
    SubSidebar,
    Conversation
  },

  computed: {
    inConversation() {
      if( this.$route.params.chatRoomId ) {
        return true
      }
      return false
    }
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    ...mapActions({
      getListConversations: 'getListConversations',
      receiveNewMessage: 'receiveNewMessage'
    })
  },

  async created() {
    try {
      this.loading = true
      await this.getListConversations()
      await new Promise(resolve => setTimeout(resolve, 200))
      this.loading = false
    } catch(error) {
      console.log(error);
    }
  },

  mounted() {
    socket.on('new-message', (message) => {
      let newMessage = {
        type: message.type,
      }
      if( message.type === 'image' ) {
        newMessage.content = 'Ảnh gửi lên.'
      } else if( message.type === 'file' ) {
        newMessage.content = 'Tệp đính kèm.'
      } else {
        newMessage.content = message.content
      }
      const lastUpdated = message.createdAt
      const conversationId = message.friendship

      this.receiveNewMessage({
        conversationId,
        newMessage,
        lastUpdated
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.page-loading {
  display: grid;
  place-items: center;
  min-height: inherit;
  height: calc(100vh - 58px - 80px - 0rem);

  img {
    width: 100px;
    height: 100px;
  }
}

#friend-chat-page {
  display: flex;
  min-height: inherit;
  height: calc(100vh - 58px - 80px - 0rem);

  .sub-sidebar {
    height: inherit;
    flex-basis: 340px;
    border-right: 1px solid #dfdfdf;
    box-shadow: 2px 0px 6px -3px rgba(9, 30, 66, .2);
  }

  .conversation {
    flex-grow: 1;
    height: inherit;
  }

  .out-conversation {
    height: inherit;
    flex-grow: 1;
    display: grid;
    place-items: center;
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    color: #c6c6c6;
  }
}
</style>
