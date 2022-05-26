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
      <h2>Team {{ status }}</h2>
      <div class="row" v-if="groupTeambyStatus.length">
        <div class="col-12 col-lg-6 team" v-for="(team, index) in groupTeambyStatus" :key="index">
          <div class="team-container">
            <img :src="require(`./../assets/img/${team.avatar}`)" alt="Avatar" class="image" style="width:100%">
            <p class="team-name">{{ team.name }}</p>
            <div class="middle">
              <div class="text" @click="goToTeam(team.id)">Xem</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row text-no-team" v-else>Chưa có team {{ status }}</div>
    </div>
  </div>
</template>

<script>
import AddTeam from '../components/teams/AddTeam.vue'

export default {
  data() {
    return {
      keyword: '',
      teamList: {},
      teams: [
        {
          id: 1,
          name: "teams 1",
          avatar: 'login-background-1.jpg',
          status: 1
        },
        {
          id: 2,
          name: "teams 2",
          avatar: "login-background-1.jpg",
          status: 1
        },
        {
          id: 3,
          name: "teams 3",
          avatar: "login-background-1.jpg",
          status: 1
        },
        {
          id: 4,
          name: "teams 4",
          avatar: "login-background-1.jpg",
          status: 2
        },
        {
          id: 5,
          name: "teams 5",
          avatar: "login-background-1.jpg",
          status: 1
        },
        {
          id: 6,
          name: "teams 6",
          avatar: "login-background-1.jpg",
          status: 1
        },
      ],
    };
  },

  methods: {
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

    prepareTeamList (teams) {
      this.teamList = {}
      this.teamList['công khai'] = []
      this.teamList['riêng tư'] = []
      teams.forEach((team) => {
        if( team.status == 1 ) {
          this.teamList['công khai'].push(team)
        } else {
          this.teamList['riêng tư'].push(team)
        }
      })
    },

    searchTeam (keyword) {
      const teams = this.teams.filter((team) => {
        if (team.name.toLowerCase().includes(keyword.toLowerCase())) {
          console.log('true')
          return true
        }
        return false
      })

      this.prepareTeamList(teams)
    }
  },

  created() {
    this.prepareTeamList(this.teams)
  },

  watch: {
    keyword() {
      this.searchTeam(this.keyword)
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
    }

    .team-container:hover {
      .image {
        opacity: 0.2;
      }

      .middle {
        opacity: 1;
      }
    }

    .text {
      background-color: #026aa7;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      padding: 8px 48px;
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
