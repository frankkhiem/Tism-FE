<template>
  <div class="team-members">
    <div class="page-title">
      <div class="title-name">
        Thành viên nhóm
      </div>
      <div class="title-btns">
        <div class="title-btn" @click="createMeeting">
          <i class="fa-solid fa-video"></i>
        </div>
        <div class="title-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </div>
      </div>
    </div>
    <div class="searchbar">
      <label for="search-members">
        <b-icon icon="search" class="icon" scale="1"></b-icon>
      </label>
      <input id="search-members" type="text" placeholder="Tìm kiếm thành viên">
    </div>
    <div class="list-members">
      <MemberItem
        :member="memberIsMe"
        class="self-member"
        :self="true"
      ></MemberItem>
      <MemberItem 
        v-for="(member, index) in membersNotMe"
        :member="member"
        :key="index"
      ></MemberItem>
    </div>
  </div>
</template>

<script>
import MemberItem from './MemberItem'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    MemberItem
  },

  computed: {
    ...mapGetters({
      user: 'profile',
      members: 'members'
    }),

    memberIsMe() {
      return this.members.find(member => member.id === this.user.userId)
    },

    membersNotMe() {
      return this.members.filter(member => member.id !== this.user.userId)
    }
  },

  methods: {
    ...mapActions({
      getUserStatus: 'getUserStatus',
      createTeamMeeting: 'createTeamMeeting',
      endTeamMeeting: 'endTeamMeeting'
    }),

    async createMeeting() {
      console.log('tao hop nhom')
      const userStatus = await this.getUserStatus()
      if( userStatus !== 'online' ) {
        this.$confirm(
          {
            title: `Tạo phòng họp thất bại`,
            message: `Hiện tại bạn không thể tạo phòng họp mới, vui lòng thử lại sau!`,
            button: {
              no: 'Đã hiểu',
            }
          }
        )
        return
      }

      const meetingInfo = await this.createTeamMeeting(this.$route.params.teamId)
      const meetingRoute = this.$router.resolve({
        name: 'TeamMeeting',
        params: {
          meetingId: meetingInfo._id
        },
        query: {
          isOwner: true
        }
      })
      const meetingWidth = window.outerWidth * 0.8
      const meetingHeight = window.outerHeight * 0.8
      const meetingLeft = window.outerWidth * 0.1
      const meetingTop = window.outerHeight * 0.08
      let meetingWindow = window.open(
        meetingRoute.href, 
        'Metting', 
        `
          width=${meetingWidth}px,
          height=${meetingHeight}px,
          left=${meetingLeft},
          top=${meetingTop}
        `
      )
      let duringTimes = 0
      let timer = setInterval(() => {
        duringTimes++
        if( meetingWindow.closed ) {
          clearInterval(timer)
          this.handleEndTeamMeeting(meetingInfo._id, duringTimes)
        }
      }, 1000)
    },

    handleEndTeamMeeting(meetingId, duringTimes) {
      if( duringTimes < 3600 ) {
        duringTimes = new Date(duringTimes * 1000).toISOString().substring(14, 19)
      } else {
        duringTimes = new Date(duringTimes * 1000).toISOString().substring(11, 19)
      }
      this.endTeamMeeting({
        meetingId,
        duringTimes
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.team-members {
  display: flex;
  flex-direction: column;
  border-right: 2px solid #dfdfdf;
}

.page-title {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;

  .title-name {
    font-size: 18px;
    color: #252525;
    font-weight: 700;
    margin-left: 1rem;
    cursor: pointer;
  }

  .title-btns {
    display: flex;
    margin-right: 1rem;

    .title-btn {
      margin-left: 10px;
      width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 50%;
      background-color: #e4e6eb;
      text-align: center;
      font-size: 18px;
      // color: #2c2c2c;
      cursor: pointer;

      &:hover {
        background-color: #d1d2d6;
      }
    }
  }
}

.searchbar {
  text-align: center;
  flex-shrink: 0;
  margin: 0 1.7rem 1rem .7rem;
  position: relative;

  .icon {
    position: absolute;
    height: 34px;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    cursor: pointer;
  }

  input {
    width: 100%;
    height: 34px;
    font-size: 14px;
    border: none;
    border-radius: 18px;
    outline: none;
    padding: 6px;
    padding-left: 40px;
    color: inherit;
    background-color: #f0f2f5;

    &:focus {
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, .2);
    }
  }
}

.list-members {
  flex-grow: 1;
  padding: 0 1.7rem 4rem .7rem;
  overflow-y: auto;

  .self-member {
    margin-bottom: 5px;
  }
}
</style>
