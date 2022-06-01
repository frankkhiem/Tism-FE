<template>
  <div id="invite-member-modal">
    <div
      class="modal-close"
      @click="$emit('close')"
      @mouseenter="hoverClose = true"
      @mouseleave="hoverClose = false"
    >
      <b-icon
        v-if="hoverClose"
        icon="x"
        class="border border-danger rounded"
        variant="danger"
        scale="1.2"
      ></b-icon>
      <b-icon
        v-else
        icon="x"
        class="border border-danger rounded"
        variant="danger"
      ></b-icon>
    </div>
    <div class="modal-title">
      <div>Mời thêm thành viên</div>
    </div>
    <div class="modal-main">
      <div v-if="loading && !sendResultUiSuccess && !sendResultUiFail" class="loading">
        <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="" />
      </div>
      
      <div v-if="!loading && sendResultUiSuccess && !sendResultUiFail">
        <span class="msg-success">{{ msgResult }}</span>
      </div>

       <div v-if="!loading && !sendResultUiSuccess && sendResultUiFail">
        <span class="msg-fail">{{ msgResult }}</span>
      </div>

      <div v-if="!loading && !sendResultUiSuccess && !sendResultUiFail">
        Mời thêm thành viên mới vào team của bạn bằng cách nhập email của họ vào
        ô bên dưới:
        <input
          type="text"
          class="email-input"
          name="email"
          placeholder="example@gmail.com"
          v-model="email"
        />
      </div>
    </div>
    <div class="modal-btns">
      <div class="cancel-btn" v-if="sendResultUiSuccess || sendResultUiFail" @click="$emit('close')">
        Hủy
      </div>
      <div class="agree-btn" v-if="!sendResultUiSuccess && !sendResultUiFail" @click="sendInvite">Mời</div>
      <div class="agree-btn" v-if="sendResultUiSuccess || sendResultUiFail" @click="continueInvite">Tiếp tục mời</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isUpdate: Boolean,
  },

  data() {
    return {
      hoverClose: false,
      email: "",
      msgResult: "",
      loading: false,
      sendResultUiSuccess: false,
      sendResultUiFail: false
    };
  },

  methods: {
    async sendInvite() {
      try {
        this.loading = true;
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${process.env.VUE_APP_API_HOST}/team/invitetopeople`,
          {
            teamId: this.$route.params.teamId,
            inviteArray: [this.email],
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data.success) {
          this.msgResult = "Gửi lời mời thành công"
          this.loading = false
          this.sendResultUiSuccess = true
        } else {
          this.msgResult = "Người dùng này đã được gửi lời mời vào nhóm hiện tại. Vui lòng nhập email khác"
          this.loading = false
          this.sendResultUiFail = true
          console.log(response.data)
        }
      } catch (error) {
        this.msgResult = "Gửi lời mời không thành công. Vui lòng kiểm tra và nhập lại email chính xác"
        this.loading = false
        this.sendResultUiFail = true
        // console.log(this.$route.params.teamId)
        // console.log(error.response.data);
      }
    },

    continueInvite() {
      this.sendResultUiSuccess = false
      this.sendResultUiFail = false
    }
  },
};
</script>

<style lang="scss" scoped>
#invite-member-modal {
  position: relative;
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;

  .modal-close {
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    padding: 10px 1.5rem;
    border-bottom: 1px solid #ddd;
  }

  .modal-main {
    margin-top: 1rem;
    padding: 0 1.5rem;
    margin-bottom: 1 rem;
    height: 70px;

    .email-input {
      background: transparent;
      border: none;
      color: #797979;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      margin: 0;
      min-height: 0;
      outline: 0;
      width: calc(100% - 18px - 16px);
      position: relative;
      left: -8px;
      padding: 2px 8px;
      box-shadow: none;
      border-radius: 3px;
      display: block;
      transition-property: background-color, border-color, box-shadow;
      transition-duration: 85ms;
      transition-timing-function: ease;
      border: 1px solid black;
      margin-top: 1rem;
      margin-left: 8px;

      &:hover {
        background: rgba(231, 227, 227, 0.8);
        //   border-radius: 3px;
      }
      &:focus {
        background: rgb(220, 217, 217);
        //   outline: 0;
      }
    }

    .msg-error {
      display: block;
      color: red;
      margin-top: 5px;
    }
  }

  .modal-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    margin-bottom: 14px;
    padding: 0 1.5rem;

    div {
      padding: 4px 12px;
      border-radius: 5px;
      cursor: pointer;
    }

    .cancel-btn:hover {
      background-color: #85dadf2f;
    }

    .agree-btn {
      margin-left: 0.3rem;
      color: #fff;
      background-color: #4bcb50;

      &:hover {
        background-color: #46b04a;
      }
    }
  }

  .loading {
    margin-top: 2rem;
    text-align: center;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .msg-success {
    color:#4bcb50;
    font-weight: 600;
  }

  .msg-fail {
    color: rgb(211, 99, 99);
    font-weight: 600;
  }
}
</style>
