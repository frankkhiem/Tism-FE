<template>
  <div class="team-page-header">
    <div class="page-information">
      <div class="team-name">{{ team.teamName }}</div>
      <div class="team-admin">
        <p
          :style="{
            borderRadius: '50%',
            height: '35px',
            width: '35px',
            userSelect: 'none',
          }"
        >
          <span class="admin-name-icon" v-if="team.adminAvatar">
            <img :src="team.adminAvatar" alt="" />
          </span>
          <!-- admin first name first letter -->
          <span class="admin-name-icon text" v-else>{{
            team.adminName.slice(0, 1).toUpperCase()
          }}</span>
        </p>
        <!-- admin first name -->
        <span class="admin-name">{{ team.adminName.split(" ").pop() }}</span>
      </div>
      <div class="invite-member" @click="inviteMemberModal">
        <i class="fa-solid fa-user-plus"></i>Mời
      </div>
    </div>
    <div class="page-nav">
      <div
        :class="{ activated: type === 'team-tasks' }"
        @click="$emit('team-tasks')"
      >
        <i class="fas fa-tasks"></i>
        Danh sách công việc
      </div>
      <div
        :class="{ activated: type === 'team-chat' }"
        @click="$emit('team-chat')"
      >
        <i class="fa-solid fa-message"></i>
        Chat nhóm
      </div>
      <div
        :class="{ activated: type === 'calendar' }"
        @click="$emit('calendar')"
      >
        <i class="fa-solid fa-calendar-days"></i>
        Lịch
      </div>
    </div>
  </div>
</template>

<script>
import InviteMemberModal from './InviteMemberModal.vue'
export default {
  // data() {
  // 	return {
  // 		type: 'team-tasks',
  // 	}
  // },
  props: {
    type: String,
    team: Object,
    // userFirstName: String,
    // userFirstNameLetter: String
  },
  methods: {
    inviteMemberModal() {
      this.$modal.show(
        InviteMemberModal,
        {
          isUpdate: false
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 600,
          height: 'auto'
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.team-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .page-nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > div {
      width: 185px;
      text-align: center;
      margin: 1rem 12px;
      padding: 5px 0;
      background-color: #fff;
      // border: 1px solid #aaa;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0px 1px 3px 1px rgba(9, 30, 66, 0.25);
      cursor: pointer;
      transition: all 0.1s linear;
      user-select: none;
      &:hover {
        background-color: #f4f5fd;
      }
      &.activated {
        color: #fff;
        background-color: #1b74e4;
      }
    }
    i {
      margin-right: 4px;
    }
  }
  .page-information {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      margin: 1rem 12px;
    }
    .team-name {
      font-size: 25px;
      font-weight: 600;
    }
    .invite-member {
      padding: 5px 2rem;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0px 1px 3px 1px rgba(9, 30, 66, 0.25);
      cursor: pointer;
      transition: all 0.1s linear;
      user-select: none;
      color: #fff;
      background-color: #1b74e4;
      &:hover {
        color: black;
        background-color: #f4f5fd;
      }
    }
    .team-admin {
      p {
        margin-bottom: 0;
        align-items: center;
        background-color: #dfe1e6;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        border: 0;
        box-sizing: border-box;
        color: #172b4d;
        display: inline-flex;
        font-size: 16px;
        font-weight: 700;
        justify-content: center;
        line-height: 40px;
        opacity: 1;
        overflow: hidden;
        white-space: nowrap;
      }
      .admin-name {
        margin-left: 9px;
        font-size: 14px;
        font-weight: 600;
      }
      .admin-name-icon {
        img {
          object-fit: cover;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
