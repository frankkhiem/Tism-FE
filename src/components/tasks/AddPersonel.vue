<template>
  <div id="add-personel-modal">
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
      <div>Chỉ định thành viên</div>
    </div>
    <div class="modal-main">
      <div class="add-personel-container">
        <div class="list-members">
          <MemberAssignee
            v-for="(member, index) in membersNotMe"
            :member="member"
            :key="index"
            @assigned="assignThis(member)"
          ></MemberAssignee>
        </div>
      </div>
    </div>
    <div class="modal-btns">
    </div>
  </div>
</template>

<script>
import MemberAssignee from "../tasks/MemberAssignee.vue"
//you need to import the CSS manually
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

import { mapGetters } from "vuex";

export default {
  name: 'AddPersonel',
  components: { MemberAssignee },
  data() {
    return {
      hoverClose: false,
      teamMembers: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "profile",
      members: "members",
    }),

    membersNotMe() {
      return this.members.filter((member) => member.id !== this.user.userId);
    },
  },
  methods: {
    assignThis(member) {
      this.$emit('close', member);
    }
  }
};
</script>

<style lang="scss" scoped>
#add-personel-modal {
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
    padding: 0 1rem;

    .add-personel-container {
      margin: 0;
      display: flex;
      justify-content: space-between;

      textarea,
      input {
        font-size: 16px;
        line-height: 28px;
        padding: 8px 16px;
        width: 100%;
        min-height: 44px;
        border: unset;
        border-radius: 6px;
        outline-color: rgb(84, 105, 212);
        background-color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px;
        resize: none;
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
      margin-left: 0.3rem;
      color: #fff;
      background-color: #4bcb50;

      &:hover {
        background-color: #46b04a;
      }
    }

    .agree-btn[disabled="disabled"] {
      pointer-events: none;
      opacity: 0.4;
    }
  }

  .list-members {
    flex-grow: 1;
    padding: 0 1.7rem 0 0.7rem;
    overflow-y: auto;

    .self-member {
      margin-bottom: 5px;
    }
  }
}
</style>
