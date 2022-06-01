<template>
  <div id="add-new-team-modal">
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
      <div v-if="!isUpdate">
        Thêm mới nhóm
      </div>
      <div v-else>
        Chỉnh sửa nhóm
      </div>
    </div>
    <div class="modal-main">
      <div class="create-team-container">
        <div class="create-team-infor" :style="{ backgroundImage: `url(${require(`../../assets/img/${teamAvatar}`)})` }">
          <div>
            <input type="text" name="name" placeholder="Thêm mới tên nhóm của bạn" class="team-name-input" v-model="teamName">
          </div>
          <div class="create-team-status">
            <p>Loại nhóm</p>
            <div class="type-input">
              <input type="text" name="name" placeholder="Thêm thể loại" class="team-name-input" v-model="teamType">
              <select v-model="teamType">
                <option disabled value="">Chọn thể loại có sẵn</option>
                <option v-for="(type, index) in typeList" :key="index" :value="type">{{ type }}</option>
              </select>
            </div>
          </div>
        </div>
        <ul class="create-team-background">
          <li class="create-team-background-item" v-for="(image, index) in teamBackgroundImages" :key="index">
            <button class="create-team-background-item-btn" :class="{ 'selected-bg-btn': teamAvatar == image }" @click="teamAvatar = image" :style="{ backgroundImage: `url(${require(`../../assets/img/${image}`)})` }"></button>
            <span class="icon-tick" :class="{ 'icon-hidden': teamAvatar == image }">✔</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="modal-btns">
      <div class="cancel-btn"  @click="$emit('close')">
        Hủy
      </div>
      <div class="agree-btn" v-if="!isUpdate" :disabled="teamName == '' || teamType == ''" @click="createTeam">
        Tạo
      </div>
      <div class="agree-btn" v-else :disabled="teamName == ''" @click="updateTeam">
        Sửa
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    isUpdate: Boolean,
    targetTeam: Object,
    typeList: Array
  },

  data() {
    return {
      hoverClose: false,
      teamId: '',
      teamName: '',
      teamAvatar: 'bgg1.jpg',
      teamType: '',
      teamBackgroundImages: [
        'bgg1.jpg',
        'bgg2.jpg',
        'bgg3.jpg',
        'bgg4.jpg',
        'bgg5.jpg',
        'bgg6.jpg',
      ]
    }
  },

  methods: {
    ...mapActions({
      createTismTeam: 'createTismTeam',
      updateTismTeam: 'updateTismTeam',
    }),

    async createTeam() {
      try {
        const response = await this.createTismTeam({
          teamName: this.teamName,
          type: this.teamType,
          avatar: this.teamAvatar
        })
        if( response.teamId ) {
          this.$emit('close')
        } else {
          // console.log(response)
          return
        }
      } catch(error) {
        console.log(error);
      }
    },

    async updateTeam() {
      try {
        const response = await this.updateTismTeam({
          teamId: this.teamId,
          teamName: this.teamName,
          type: this.teamType,
          avatar: this.teamAvatar
        })
        if( response.success ) {
          this.$emit('close')
        } else {
          // console.log(response)
          return
        }
      } catch(error) {
        console.log(error);
      }
    },
  },

  created() {
    if(this.isUpdate && this.targetTeam) {
      this.teamName = this.targetTeam.teamName
      this.teamAvatar = this.targetTeam.avatar
      this.teamType = this.targetTeam.type
      this.teamId = this.targetTeam.teamId
    }
  }
}
</script>

<style lang="scss" scoped>
#add-new-team-modal {
  position: relative;
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;

  .modal-close {
    position: absolute;
    top: 0;
    right: .5rem;
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

    .create-team-container {
      margin: 0 auto;
      display: flex;
      width: 520px;

      .create-team-infor {
        background-color: transparent;
        box-sizing: border-box;
        height: 180px;
        margin: 0;
        padding: 10px 10px 10px 16px;
        position: relative;
        width: 406px;
        border-radius: 3px;
        display: block;
        background-size: cover;
        background-position: 50%;
        color: #fff;
        line-height: 20px;
        text-decoration: none;
        margin-right: 16px;
      }

      .team-name-input {
        border: none;
        color: white;
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
        background: hsla(0, 0%, 5%, 0.15);
        &:hover {
          background: hsla(0, 0%, 100%, 0.15);
          //   border-radius: 3px;
        }
        &:focus {
          background: hsla(0, 0%, 100%, 0.3);
          //   outline: 0;
        }

        &::placeholder {
            color: white;
            opacity: 1;
        }
      }

      .create-team-status {
        margin-top: 20px;
        .type-input {
          display: flex;
        }

        select {
          border: none;
          // color: #312e2e;
          color: white;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          background: hsla(0, 0%, 5%, 0.15);
          &:hover {
            background: hsla(0, 0%, 100%, 0.15);
            //   border-radius: 3px;
          }
          &:focus {
            background: hsla(0, 0%, 100%, 0.3);
            //   outline: 0;
          }

          option {
            color: #312e2e;
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
          }
        }

        p {
          margin-left: -8px;
          color: #312e2e;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
        }

        input {
          margin-right: 4px;
        }

        label {
          margin-right: 30px;
          position: relative;
          bottom: 1px;
          font-size: 16px;
          font-weight: 700;
        }
      }

      .create-team-background {
        height: 96px;
        width: 100px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        list-style: none;
        margin: 0;

        .create-team-background-item {
          height: 28px;
          width: 28px;
          margin-bottom: 6px;
          list-style: none;
          position: relative;
        }

        .create-team-background-item-btn {
          background: none;
          background-color: #fff;
          background-position: 50%;
          background-size: cover;
          box-shadow: none;
          align-items: center;
          border-radius: 3px;
          color: rgba(0, 0, 0, 0.4);
          display: flex;
          height: 100%;
          justify-content: center;
          margin: 0;
          min-height: 0;
          padding: 0;
          position: relative;
          line-height: 0;
          width: 100%;
          cursor: pointer;
          border: none;
          text-decoration: none;
          &:hover {
            opacity: 0.15;
            //   border-radius: 3px;
          }
          &:focus {
            opacity: 0.3;
            outline: none;
            border: none;
            //   outline: 0;
          }
        }

        .selected-bg-btn {
          opacity: 0.3;
          outline: none;
          border: none;
        }

        .icon-tick {
          position: absolute;
          top: 3px;
          left: 8px;
          display: none;
        }

        .icon-tick.icon-hidden {
          display: inline-block;
        }
      }
    }
  }

  .modal-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
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
      margin-left: .3rem;
      color: #fff;
      background-color: #4bcb50;

      &:hover {
        background-color: #46b04a;
      }
    }

    .agree-btn[disabled=disabled] {
      pointer-events: none;
      opacity: 0.4;
    }
  }
}
</style>
