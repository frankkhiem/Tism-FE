<template>
  <div class="team-chatbox">
    <div v-if="loading" class="loading-page">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-show="loadingMore" class="loading-more">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-if="!loading" v-show="messages.length === 0" class="no-messages">
      Chưa có tin nhắn thảo luận trong nhóm!
    </div>
    <div 
      v-show="!loading && messages.length > 0" 
      class="messages"
      ref="listMessages"
      @scroll.passive="checkScroll"
    >
      <TeamMessageItem
        v-for="(mess, index) in messages"
        :key="index"
        :message="mess"
        :userId="user.userId"
        @deleted="removeMessage(index)"
      ></TeamMessageItem>
    </div>
    <div v-show="showScrollToBottom" class="scroll-to-bottom">
      <span class="scroll-btn" @click="scrollToBottom">
        <i class="fa-solid fa-arrow-down"></i>
      </span>
    </div>
    <!--  -->
    <div class="chatbox">
      <div class="send-options">
        <input 
          type="file" 
          ref="selectFile" 
          style="display: none"
          @input="handleSendFile"
        >
        <div 
          class="link-option" 
          @click="$refs.selectFile.value = null; $refs.selectFile.click()"
        >
          <i class="fa-solid fa-paperclip"></i>
        </div>
        <input 
          type="file" 
          ref="selectImage" 
          accept="image/*" 
          style="display: none"
          @input="handleSendImage"
        >
        <div 
          class="image-option" 
          @click="$refs.selectImage.value = null; $refs.selectImage.click()"
        >
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
            @keydown.enter.exact.prevent
            @keyup.enter.exact="handleSendTextMessage"
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
import TeamMessageItem from './TeamMessageItem'
import EmojiPicker from 'vue-emoji-picker'

import { mapGetters, mapActions } from 'vuex'
import socket from '@/helpers/socketClient'

export default {
  components: {
    TeamMessageItem,
    EmojiPicker
  },

  computed: {
    ...mapGetters({
      user: 'profile'
    })
  },

  data() {
    return {
      loading: false,
      loadingMore: false,
      showScrollToBottom: false,
      messages: [],
      totalMessages: 0,
      message: '',
    }
  },

  methods: {
    ...mapActions({
      getRecentTeamMessages: 'getRecentTeamMessages',
      sendTeamTextMessage: 'sendTeamTextMessage',
      sendTeamImageMessage: 'sendTeamImageMessage',
      sendTeamFileMessage: 'sendTeamFileMessage'
    }),

    checkScroll() {
      const messages = this.$refs.listMessages
      let scrollRangeFromBottom = messages.scrollHeight - messages.offsetHeight - messages.scrollTop
      if( scrollRangeFromBottom > 400 ) {
        this.showScrollToBottom = true
      } else {
        this.showScrollToBottom = false
      }

      if( messages.scrollTop === 0 && this.messages.length < this.totalMessages ) {
        this.handleLoadMoreMessages(scrollRangeFromBottom)
        // console.log(scrollRangeFromBottom)
      }
    }, 

    scrollToBottom() {
      const messages = this.$refs.listMessages

      setTimeout(() => {
        messages.scrollTop = messages.scrollHeight /*- messages.offsetHeight*/
      }, 0)
    },

    async handleLoadMoreMessages(scrollRangeFromBottom) {
      this.loadingMore = true
      await new Promise(resolve => setTimeout(resolve, 200))
      const data = await this.getRecentTeamMessages({
        teamId: this.$route.params.teamId,
        skip: this.messages.length,
        take: 10
      })
      this.totalMessages = data.totalMessages
      await new Promise(resolve => setTimeout(() => {
        this.messages.unshift(...data.messages)
        resolve()
      }, 0))
      const messages = this.$refs.listMessages
      // console.log(messages.scrollHeight, messages.offsetHeight, scrollRangeFromBottom)
      messages.scrollTop = messages.scrollHeight - messages.offsetHeight - scrollRangeFromBottom
      this.loadingMore = false
    },

    resizeInput(e) {
      // textarea auto resize
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight + 2}px`
    },

    insertEmoji(emoji) {
      this.message += emoji
    },

    async handleSendTextMessage() {
      const content = this.message.trim()
      if( content !== '' ) {
        // console.log('gui ' + content)
        const sendedMessage = await this.sendTeamTextMessage({
          teamId: this.$route.params.teamId,
          content
        })
        if( sendedMessage ) {
          this.messages.push(sendedMessage)
          this.totalMessages++
        }
      }
      this.message = ''
      document.querySelector('textarea.chat-input').style.height = '36px'
    },

    async handleSendImage(e) {
      let file = e.target.files[0]
      if( !file ) return
      let formData = new FormData()
      formData.append('image-message', file)
      const sendedMessage = await this.sendTeamImageMessage({
        teamId: this.$route.params.teamId,
        formData
      })
      if( sendedMessage ) {
        this.messages.push(sendedMessage)
        this.totalMessages++
      }
    },

    async handleSendFile(e) {
      let file = e.target.files[0]
      if( !file ) return
      let formData = new FormData()
      let sendedMessage
      if( (/^image\/.+$/).test(file.type) ) {
        formData.append('image-message', file)
        sendedMessage = await this.sendTeamImageMessage({
          teamId: this.$route.params.teamId,
          formData
        })
      } else {
        formData.append('file-message', file)
        sendedMessage = await this.sendTeamFileMessage({
          teamId: this.$route.params.teamId,
          formData
        })
      }
      if( sendedMessage ) {
        this.messages.push(sendedMessage)
        this.totalMessages++
      }
    },

    removeMessage(index) {
      this.messages.splice(index, 1)
      this.totalMessages--
    }
  },

  async created() {
    this.loading = true
    const data = await this.getRecentTeamMessages({
      teamId: this.$route.params.teamId,
      skip: 0,
      take: 10
    })
    this.totalMessages = data.totalMessages
    this.messages = data.messages
    this.loading = false
    // listen event new-team-message
    socket.on('new-team-message', newMessage => {
      if( newMessage.team === this.$route.params.teamId ) {
        this.messages.push(newMessage)
        this.totalMessages++
      }
    })
    // listen event new-team-meeting
    socket.on('new-team-meeting', newMessage => {
      if( newMessage.team === this.$route.params.teamId ) {
        this.messages.push(newMessage)
        this.totalMessages++
      }
    })
    // listen event end-team-meeting
    socket.on('end-team-meeting', meeting => {
      if( meeting.team === this.$route.params.teamId ) {
        for( let i = 0; i < this.messages.length; i++ ) {
          if( meeting._id === this.messages[i]._id ) {
            this.messages.splice(i, 1, meeting)
            break
          }
        }
      }
    })
    // listen event deleted-team-message
    socket.on('deleted-team-message', deletedMessage => {
      if( deletedMessage.team === this.$route.params.teamId ) {
        for( let i = 0; i < this.messages.length; i++ ) {
          if( this.messages[i]._id === deletedMessage._id ) {
            this.messages.splice(i, 1)
            break
          }
        }
        this.totalMessages--
      }
    })
  },

  watch: {
    async messages() {
      if( !this.showScrollToBottom ) {
        await new Promise(resolve => setTimeout(resolve, 200))
        this.scrollToBottom()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.team-chatbox {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 1rem 0 2rem;
}

.loading-page {
  flex-grow: 1;
  width: 100%;
  display: grid;
  place-items: center;

  img {
    width: 60px;
    height: 60px;
    transform: translateY(-50%)
  }
}

.loading-more {
  position: absolute;
  top: 1rem;
  width: 100%;
  text-align: center;

  img {
    width: 40px;
    height: 40px;
  }
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
  // scroll-behavior: smooth;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
  }

  to {
    transform: translateY(0);
  }
}

.scroll-to-bottom {
  position: absolute;
  bottom: 80px;
  width: 100%;
  text-align: center;
  animation: slideUp .2s ease-out;

  span.scroll-btn {
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    color: #026aa7;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.3);
    transition: background-color .1s linear;
    cursor: pointer;

    &:hover {
      background-color: #e8e8e8;
    }
  }
}

.chatbox {
  flex-basis: 50px;
  flex-shrink: 0;
  display: flex;

  .send-options {
    display: flex;
    align-items: center;
    margin: 0 1.5rem 0 0rem;

    div {
      align-self: flex-end;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 50%;
      font-size: 20px;
      color: #026aa7;
      margin-left: 16px;
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
      right: 60px;
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
      margin-left: 1.5rem;
      margin-bottom: .5rem;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>