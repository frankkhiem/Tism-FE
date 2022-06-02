<template>
  <div class="message-item" :class="{ self: message.from === userId }">
    <div class="main-message"
      @mouseenter="hoverMessage = true"
      @mouseleave="handleBlurMessage"
    >
      <div
        v-if="message.from === userId"
        v-show="hoverMessage"
        class="message-actions"
      >
        <i 
          class="fa-solid fa-ellipsis-vertical actions-icon"
          @click="showMoreActions"
        ></i>
        <div 
          v-if="showActions" 
          class="actions-container"
          v-click-outside-element="hideMoreActions"
        >
          <div class="delete-message" @click="handleDeleteMessage">
            Xóa tin nhắn
          </div>
        </div>
      </div>
      <div v-if="message.to === userId" class="message-avatar">
        <img v-if="friendAvatar" :src="friendAvatar" alt="">
        <img v-else src="@/assets/img/anonymous.png" alt="">
      </div>
      <div 
        v-if="message.type === 'text'"
        class="message-content" 
        :class="{ self: message.from === userId }"
      >
        {{ message.content }}
      </div>
      <div 
        v-if="message.type === 'image'"
        class="message-content image"
        :class="{ self: message.from === userId }"
        @click="showImageModal"
      >
        <img :src="message.content" alt="">
      </div>
      <div 
        v-if="message.type === 'file'"
        class="message-content file"
        :class="{ self: message.from === userId }"
        @click="downloadFile"
      >
        <i class="fa-solid fa-file-arrow-down"></i>
        <span>{{ message.content }}</span>
        <a 
          ref="fileUrlDownload"
          :href="message.description" 
          :style="{ display: 'none' }"
        ></a>
      </div>
      <div
        v-if="message.type === 'video-call'"
        class="message-content video-call"
        :class="{ self: message.from === userId }"
      >
        <div class="video-call__title">
          <i 
            v-if="message.description === 'success' || message.description === 'accept'" 
            class="fa-solid fa-phone-flip"
          ></i>
          <i v-else class="fa-solid fa-phone-slash"></i>
          Cuộc gọi Video
        </div>
        <div class="video-call__status">
          <div v-if="message.description === 'success' && message.from === userId">
            Cuộc gọi đi, trong {{ message.content }}
          </div>
          <div 
            v-if="((message.description === 'cancel' 
            || message.description === 'reject')
            && message.from === userId)
            || message.description === 'initial'"
          >
            Không thành công
          </div>
          <div v-if="message.description === 'success' && message.to === userId">
            Cuộc gọi đến, trong {{ message.content }}
          </div>
          <div v-if="message.description === 'cancel' && message.to === userId">
            Cuộc gọi nhỡ
          </div>
          <div v-if="message.description === 'reject' && message.to === userId">
            Đã từ chối
          </div>
          <div v-if="message.description === 'accept'">
            Thành công
          </div>
        </div>
        <div class="video-call__btn" @click="initVideoCall">
          Gọi lại
        </div>
      </div>
    </div>
    <div class="time-ago" ref="timeAgo" :datetime="message.createdAt"></div>
  </div>
</template>

<script>
import ImageModal from './ImageModal'

import { mapActions } from 'vuex'
import { format, render, register } from 'timeago.js'
import vieLocaleFunc from '@/helpers/timeAgoVie'

register('VN', vieLocaleFunc)

export default {
  props: {
    message: {
      type: Object
    },
    friendAvatar: {
      type: String
    },
    userId: {
      type: String
    }
  },

  computed: {
    timeago() {
      return format(this.message.createdAt)
    }
  },

  data() {
    return {
      hoverMessage: false,
      showActions: false
    }
  },

  methods: {
    ...mapActions({
      deleteMessage: 'deleteMessage'
    }),

    initVideoCall() {
      this.$emit('init-video-call')
    },

    showImageModal() {
      this.$modal.show(
        ImageModal,
        { 
          imageUrl: this.message.content,
          imageUrlDownload: this.message.description
        },
        {
          width: '80%',
          height: '95%'
        }
      )
    },

    downloadFile() {
      this.$refs.fileUrlDownload.click()
    },

    handleBlurMessage() {
      if( !this.showActions ) {
        this.hoverMessage = false
      }
    },

    showMoreActions() {
      setTimeout(() => {
        this.showActions = true
      }, 0)
    },

    hideMoreActions() {
      setTimeout(() => {
        this.showActions = false
        this.hoverMessage = false
      }, 1)
    },

    handleDeleteMessage() {
      this.hideMoreActions()
      this.$confirm(
        {
          title: `Xóa tin nhắn`,
          message: `Tin nhắn này sẽ bị thu hồi với tất cả người dùng trong cuộc trò chuyện!`,
          button: {
            no: 'Hủy',
            yes: 'Xóa'
          },
          callback: async confirm => {
            if (confirm) {
              await this.deleteMessage({ 
                conversationId: this.message.friendship,
                messageId: this.message._id
              })
              // console.log('xoa thanh cong')
            }
          }
        }
      )
    }
  },

  mounted() {
    render(this.$refs.timeAgo, 'VN')
  },

  watch: {
    async message() {
      await new Promise(resolve => setTimeout(resolve, 0))
      render(this.$refs.timeAgo, 'VN')
    }
  }
}
</script>

<style lang="scss" scoped>
.message-item {
  margin: 1.5rem 1.5rem 0;
  display: flex;
  flex-direction: column;

  &:first-child {
    margin-top: 0;
  }

  &.self {
    align-items: flex-end;
  }

  &:first-child {
    .main-message .message-actions .actions-container {
      top: 50%;
      left: 0;
      transform: translate(calc(-100% - 1rem), -50%);

      &::after {
        display: none;
      }
    }
  }
}

.main-message {
  display: flex;
  align-items: center;

  .message-actions {
    position: relative;
    
    i.actions-icon {
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      font-size: 16px;
      color: #b5b5b5;
      background-color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }
    }

    .actions-container {
      position: absolute;
      top: 0;
      left: 50%;
      padding: 6px;
      transform: translate(-50%, calc(-100% - 20px));
      background-color: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, .25);
      border-radius: 6px;
      z-index: 10;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        border: 8px solid transparent;
        border-top: 8px solid #fff;
        transform: translate(-50%, calc(100% - 1px));
        filter: drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.1));

      }

      .delete-message {
        width: 100px;
        text-align: center;
        padding: 5px 8px;
        font-size: 14px;
        font-weight: 600;
        color: #2c3e50;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: #eee;
        }
      }
    }
  }

  .message-avatar {
    width: 28px;
    height: 28px;

    img {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .message-content {
    max-width: 500px;
    margin-left: 12px;
    padding: .5rem 1rem;
    font-size: 16px;
    border-radius: 20px;
    text-align: left;
    color: inherit;
    background-color: #ebe6eb;

    &.self {
      color: #fff;
      background-color: #0084ff;
    }

    &.image {
      padding: 0;

      &.self {
        background-color: #ebe6eb;
      }

      img {
        max-width: 300px;
        max-height: 300px;
        object-fit: cover;
        border: 1px solid #ddd;
        border-radius: 20px;
        cursor: pointer;

        &:hover {
          filter: brightness(90%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);
        }
      }
    }

    &.file {
      display: flex;
      align-items: center;
      cursor: pointer;

      i {
        flex-shrink: 0;
        width: 34px;
        height: 34px;
        font-size: 18px;
        line-height: 34px;
        text-align: center;
        margin-right: 12px;
        color: #466292;
        background-color: #d6d6d6;
        border-radius: 50%;
      }

      &:hover span {
        text-decoration: underline;
      }
    }

    &.video-call {
      padding: 12px 1rem;

      .video-call__title i {
        width: 32px;
        height: 32px;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        margin-right: 6px;
        color: #466292;
        background-color: #d6d6d6;
        border-radius: 50%;
      }

      .video-call__status {
        font-size: 12px;
        font-weight: 700;
        padding-left: 44px;
        padding-right: .5rem;
      }

      .video-call__btn {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
        padding: 4px 0;
        border-radius: 6px;
        color: #2c3e50;
        background-color: #fff;
        cursor: pointer;

        &:hover {
          background-color: #d6d6d6;
        }
      }
    }
  }
}

.time-ago {
  color: #666;
  font-size: 12px;
  margin-top: 8px;
}
</style>
