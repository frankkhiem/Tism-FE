<template>
  <div id="teams-page" class="container">
    <div class="row">
      <div class="col-12 col-lg-6 team">
        <div class="create-new-team" @click="createNewTeam">
          <i class="fa-solid fa-circle-plus"></i>
          <span>Tạo mới nhóm của bạn</span>
        </div>
      </div>
      <div class="col-12 col-lg-6 team-search">
        <sui-input
          v-model="keyword"
          class="team-search-input"
          inverted
          color="blue"
          fitted="true"
          icon="blue search circular fitted inverted link icon"
        ></sui-input>
      </div>
    </div>
    <div v-for="(groupTeambyStatus, status, index) in teamList" :key="index">
      <h2 v-if="status === 'public'">Team công khai</h2>
      <h2 v-if="status === 'private'">Team riêng tư</h2>
      <div class="row" v-if="groupTeambyStatus.length">
        <div class="col-12 col-lg-6 team" v-for="(team, index) in groupTeambyStatus" :key="index">
          <div class="team-container">
            <img :src="require(`./../assets/img/${team.avatar}`)" alt="Avatar" class="image" style="width:100%">
            <p class="team-name">{{ team.teamName }}</p>
            <div class="middle">
              <div class="update-text" @click="updateTeam(team)">Chỉnh sửa</div>
              <div class="text" @click="goToTeam(team.teamId)">Xem</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-no-team" v-else>
        <span v-if="status === 'public'">Chưa có team công khai</span>
        <span v-if="status === 'private'">Chưa có team riêng tư</span>
      </div>
    </div>
  </div>
</template>

<script>
import AddTeam from '../components/teams/AddTeam.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      keyword: '',
      teamList: {},
    };
  },

  computed: {
    ...mapGetters({
      teams: 'teamList',
    })
  },

  methods: {
    ...mapActions({
      getTeamList: 'getTeamList',
    }),

    getTeamAvatar(teamAvatar) {
      return require('./../assets/img/' + teamAvatar)
    },

    goToTeam(id) {
      this.$router.push('/team/' + id);
    },

    createNewTeam () {
      this.$modal.show(
        AddTeam,
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
      )
    },

    updateTeam (team) {
      this.$modal.show(
        AddTeam,
        {
          targetTeam: team,
          isUpdate: true
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 600,
          height: 'auto'
        }
      )
    },

    prepareTeamList (teams) {
      this.teamList = {}
      this.teamList['public'] = []
      this.teamList['private'] = []
      teams.forEach((team) => {
        if( team.type === 'public' ) {
          this.teamList['public'].push(team)
        } else {
          this.teamList['private'].push(team)
        }
      })
    },

    searchTeam (keyword) {
      const teams = this.teams.filter((team) => {
        if (team.teamName.toLowerCase().includes(keyword.toLowerCase())) {
          console.log('true')
          return true
        }
        return false
      })

      this.prepareTeamList(teams)
    }
  },

  async created() {
    await this.getTeamList()
    this.prepareTeamList(this.teams)
  },

  watch: {
    keyword(keyword) {
      this.searchTeam(keyword)
    },

    teams(newTeams) {
      this.prepareTeamList(newTeams)
    }
  }
}
</script>

<style lang="scss" scoped>
#teams-page {
  padding: 3rem 4rem 0;

  .team {
    margin-bottom: 3rem;

    .team-container {
        width: 80%;
        height: 100%;
        margin: 0 auto;
        border-radius: 5px;
        position: relative;
        box-shadow: 0 1px 4px rgba(9, 30, 66, .25), 0 0 8px 1px rgba(9, 30, 66, .08);
        cursor: pointer;
    }

    .image {
      opacity: 1;
      display: block;
      width: 100%;
      max-height: 200px;
      height: auto;
      transition: .5s ease;
      backface-visibility: hidden;
      border-radius: 5px;
    }

    .middle {
      transition: .5s ease;
      opacity: 0;
      position: absolute;
      top: 80%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
      display: flex;
      justify-content: space-between;
      width: 80%;
    }

    .team-name {
      text-transform: uppercase;
      font-weight: 800;
      font-size: 18px;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
      color: white;
    }

    .team-container:hover {
      .image {
        opacity: 0.2;
      }

      .middle {
        opacity: 1;
      }

      .team-name {
        color: rgb(47, 43, 43);
      }
    }

    .text {
      background-color: #026aa7;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      padding: 8px 30px;
      margin-left: 10px;
    }

    .update-text {
      background-color: #30b859;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      padding: 8px 20px;
      margin-right: 10px;
    }
  }

  .create-new-team {
    width: 80%;
    height: 200px;
    margin: 0 auto;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 4px rgba(9, 30, 66, .25), 0 0 8px 1px rgba(9, 30, 66, .08);
    cursor: pointer;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      transition: .5s ease;
      color: white;
      background: gray;
    }

    span {
      margin-left: 15px;
    }
  }
  
  .team-search {
    display: flex;
    justify-content: flex-end;

    .team-search-input {
      border: 1px solid #ccc;
      border-radius: 5px;
      max-height: 45px;
      margin-right: 50px;
    }
  }

  .text-no-team {
    justify-content: center;
    align-items: center;
    margin: 4rem auto;
  }
}
</style>
