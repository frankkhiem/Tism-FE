<template>
  <div class="messenger">
    <div v-if="!messages || messages.length === 0" class="no-messages">
      Chưa có tin nhắn trong cuộc trò chuyện!
    </div>
    <div v-else class="messages">
      <MessageItem
        v-for="(mess, index) in messages"
        :key="index"
        :message="mess"
        :friendAvatar="friendAvatar"
        :userId="user.userId"
      ></MessageItem>
    </div>
    <div class="chatbox">
      <div class="send-options">
        <div class="link-option">
          <i class="fa-solid fa-paperclip"></i>
        </div>
        <div class="image-option">
          <i class="fa-solid fa-image"></i>
        </div>
      </div>
      <div class="chat-form">
        <form @submit.prevent="handleSendTextMessage" ref="formMessage">
          <textarea 
            class="chat-input" 
            placeholder="Aa..."
            rows="1"
            @input="resizeInput"
            @keydown="checkEnterSubmit"
            @keyup="enterSubmit"
            v-model="message"
          ></textarea>
          <emoji-picker @emoji="insertEmoji">
            <div 
              class="emoji-invoker"
              slot="emoji-invoker" 
              slot-scope="{ events: { click: clickEvent } }" 
              @click.stop="clickEvent"
            >
              <i class="fa-solid fa-face-smile"></i>
            </div>
            <div slot="emoji-picker" slot-scope="{ emojis, insert }">
              <div class="emoji-picker">
                <div>
                  <div class="category" v-for="(emojiGroup, category) in emojis" :key="category">
                    <h5>{{ category }}</h5>
                    <div class="emojis">
                      <span
                        v-for="(emoji, emojiName) in emojiGroup"
                        :key="emojiName"
                        @click="insert(emoji)"
                        :title="emojiName"
                      >{{ emoji }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </emoji-picker>
          <button class="send-btn">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MessageItem from './MessageItem'
import EmojiPicker from 'vue-emoji-picker'

import { mapGetters, mapActions } from 'vuex'
import socket from '@/helpers/socketClient'

export default {
  components: {
    MessageItem,
    EmojiPicker
  },

  props: {
    messages: {
      type: Array
    },
    friendAvatar: {
      type: String
    }
  },

  computed: {
    ...mapGetters({
      user: 'profile'
    })
  },

  data() {
    return {
      message: ''
    }
  },

  methods: {
    ...mapActions({
      sendTextMessage: 'sendTextMessage'
    }),

    resizeInput(e) {
      // textarea auto resize
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight + 2}px`
    },

    checkEnterSubmit(e) {
      if( e.keyCode == 13 && !e.shiftKey ) {
        e.preventDefault()
      } 
    },

    enterSubmit(e) {
      if( e.keyCode == 13 && !e.shiftKey ) {
        this.handleSendTextMessage()
      }
    },

    scrollToBottom() {
      const listMessages = document.querySelector('.messages')
      if( listMessages ) {
        listMessages.scrollTop = listMessages.scrollHeight - listMessages.offsetHeight
      }
    },

    insertEmoji(emoji) {
      this.message += emoji
    },

    async handleSendTextMessage() {
      if( this.message === '' ) return
      const content = this.message
      this.message = ''
      await this.sendTextMessage({
        conversationId: this.$route.params.chatRoomId, 
        content
      })
      this.scrollToBottom()
      document.querySelector('textarea.chat-input').style.height = '36px'
    }
  },

  created() {
    socket.on('new-message', (message) => {
      this.messages.push(message)
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
    })
  },

  mounted() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
  },

  destroyed() {
    socket.off("new-message")
  },

  watch: {
    messages() {
      this.scrollToBottom()
    }
  }
}
</script>

<style lang="scss" scoped>
.messenger {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
}

.no-messages {
  flex-grow: 1;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #c6c6c6;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
}

.chatbox {
  flex-basis: 50px;
  flex-shrink: 0;
  display: flex;

  .send-options {
    display: flex;
    align-items: center;
    margin: 0 1rem;

    div {
      align-self: flex-end;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 50%;
      font-size: 20px;
      color: #026aa7;
      margin-left: 6px;
      margin-bottom: .5rem;
      cursor: pointer;

      &:hover {
        background-color: #f1f1f1;
      }
    }
  }

  .chat-form {
    flex-grow: 1;
    align-self: flex-end;
    margin-right: 4rem;

    form {
      display: flex;
      align-items: center;
      position: relative;
    }

    textarea.chat-input {
      align-self: flex-end;
      flex-grow: 1;
      border-radius: 20px;
      padding: 5px 1.2rem;
      padding-right: 2rem;
      margin: .5rem 0;
      font-size: 1rem;
      outline: none;
      border: 1px solid #888;
      resize: none;
      overflow-y: hidden;

      &:focus {
        box-shadow: 0 0 4px 0px rgba(0, 0, 0, .5);
      }
    }

    .emoji-invoker {
      position: absolute;
      right: 52px;
      bottom: 10px;
      font-size: 20px;
      color: #026aa7;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }
    }

    .emoji-picker {
      position: absolute;
      bottom: 55px;
      right: 36px;
      z-index: 1;
      font-family: inherit;
      border: 1px solid #aaa;
      width: 18rem;
      height: 21rem;
      overflow-y: scroll;
      padding: 1rem;
      box-sizing: border-box;
      border-radius: 0.5rem;
      background: #fff;
      box-shadow: 0 0 5px 2px rgba(0, 0, 0, .3);

      .category:first-child > h5 {
        margin-top: 0;
      }

      h5 {
        margin-bottom: 0;
        margin-top: 1rem;
        color: #b1b1b1;
        text-transform: capitalize;
        font-size: 0.8rem;
        cursor: default;
      }

      .emojis {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &::after {
          content: "";
          flex: auto;
        }

        span {
          padding: 0.2rem;
          cursor: pointer;
          border-radius: 5px;

          &:hover {
            background: #ececec;
            cursor: pointer;
          }
        }
      }
    }

    .send-btn {
      align-self: flex-end;
      outline: none;
      border: none;
      font-size: 22px;
      color: #026aa7;
      background-color: #fff;
      margin-left: 1rem;
      margin-bottom: .5rem;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
