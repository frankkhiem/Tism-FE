<template>
  <div id="invites-modal">
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
      <div>
        Danh sách lời mời tham gia nhóm của bạn
      </div>
    </div>
    <div class="modal-main">
      <div class="one-invite" v-for="(invite, index) in invites" :key="index">
        <span class="team-admin">{{ invite.adminName }}</span><span> đã gửi cho bạn lời mời vào nhóm: </span><span class="team-name">{{ invite.teamName }}</span>
        <div class="btns">
          <div class="refuse" @click="refuseInvite(invite.inviteId, invite.teamName)">
            Từ chối
          </div>
          <div class="accept" @click="acceptInvite(invite.inviteId)">
            Chấp nhận
          </div>
        </div>
      </div>
      <div class="one-invite" v-if="invites.length == 0">Không có lời mời nào</div>
    </div>
    <!-- <div class="modal-btns">
      <div class="cancel-btn"  @click="$emit('close')">
        Hủy
      </div>
      <div class="agree-btn">
        Tạo
      </div>
    </div> -->
  </div>
</template>
 
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    isUpdate: Boolean,
  },
 
  data() {
    return {
      hoverClose: false,
    }
  },

  computed: {
    ...mapGetters({
      invites: 'inviteList'
    })
  },

  methods: {
    ...mapActions({
      refuseTismInvite: 'refuseInvite',
      acceptTismInvite: 'acceptInvite',
      getInviteList: 'getInviteList'
    }),

    refuseInvite(id, teamName) {
      this.$confirm(
        {
          title: `Từ chối lời mời tham gia nhóm '${teamName}'`,
          message: `Bạn có chắc muốn từ chối lời mời hiện tại`,
          button: {
            no: 'Hủy',
            yes: 'Đồng ý'
          },
          callback: async confirm => {
            if (confirm) {
              await this.refuseTismInvite(`${id}`)
            }
          }
        }
      )
    },

    async acceptInvite(id) {
      await this.acceptTismInvite(id)
    }
  },

  async created() {
    await this.getInviteList()
  },
}
</script>
 
<style lang="scss" scoped>
#invites-modal {
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
    margin-bottom: 1rem;
    height: calc(600px - 50px - 1rem);
    overflow-y: scroll;
  }
 
  .btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
 
    div {
      padding: 4px 12px;
      border-radius: 5px;
      cursor: pointer;
    }
 
    .accept {
      margin-left: .3rem;
      color: #fff;
      background-color: #4bcb50;
 
      &:hover {
        background-color: #46b04a;
      }
    }

    .refuse {
      margin-left: .3rem;
      color: #fff;
      background-color: #ef5656;
 
      &:hover {
        background-color: #c5342a;
      }
    }
  }

  .team-admin,
  .team-name {
    font-weight: bold;
  }

  .one-invite {
    padding: 10px;
    margin: 10px auto;
    border-radius: 5px;
    background: #cac6c6;
  }
}
</style>
