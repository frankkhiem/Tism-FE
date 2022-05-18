<template>
  <div class="chatroom" :class="{ activated: activated }" @click="selectConversation">
    <div class="avatar" :class="{ online: conversation.friendStatus === 'online' }">
      <img v-if="conversation.friendAvatar" :src="conversation.friendAvatar" alt="">
      <div v-else class="avatar-text">
        {{ conversation.friendFirstNameLetter }}
      </div>
    </div>
    <div class="main-info">
      <div class="friend-name" :class="{unseen: !conversation.isSeen}">
        {{ conversation.friendFullName }}
      </div>
      <div class="last-message" :class="{unseen: !conversation.isSeen}">
        {{ conversation.lastMessage.content }}
      </div>
    </div>
    <div class="unseen-badge" :class="{unseen: !conversation.isSeen}"></div>
  </div>
</template>

<script>
export default {
  props: {
    conversation: {
      type: Object
    }
  },

  computed: {
    activated() {
      if( this.$route.params.chatRoomId === this.conversation.conversationId ) {
        return true
      }
      return false
    }
  },

  data() {
    return {
      
    }
  },

  methods: {
    selectConversation() {
      if( this.conversation.conversationId === this.$route.params.chatRoomId ) return
      this.$router.push({
        name: 'FriendChat',
        params: {
          chatRoomId: this.conversation.conversationId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chatroom {
  display: flex;
  align-items: center;
  padding: .5rem;
  margin: 0 .5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #091e4214;
  }

  &.activated {
    background-color: #eaf3ff;
  }

  .avatar {
    width: 56px;
    height: 56px;
    position: relative;

    &-text {
      width: inherit;
      height: inherit;
      line-height: 56px;
      border-radius: 50%;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      background-color: #ccc;
    }

    img {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      object-fit: cover;
    }

    &.online::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: #31a24c;
    }
  }

  .main-info {
    flex-grow: 1;
    padding: 0;
    padding-left: 12px;

    .friend-name {
      font-size: 1rem;
      font-weight: 600;

      &.unseen {
        font-weight: 700;
      }
    }

    .last-message {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
      color: #65676b;

      &.unseen {
        color: #1876f2;
        font-weight: 600;
      }
    }
  }

  .unseen-badge {
    flex-basis: 1.5rem;
    position: relative;

    &.unseen::after {
      content: '';
      width: 12px;
      height: 12px;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #1876f2;
      border-radius: 50%;
      position: absolute;
    }
  }
}
</style>
