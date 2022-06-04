<template>
  <div id="teams-page" class="container">
    <div class="row-header">
      <div class="team">
        <div class="create-new-team" @click="createNewTeam">
          <i class="fa-solid fa-circle-plus"></i>
          <span style="margin-left: 8px;">Tạo mới nhóm của bạn</span>
        </div>
      </div>
      <div class="team-search">
        <sui-input
          v-model="keyword"
          class="team-search-input"
          inverted
          color="blue"
          fitted="true"
          icon="blue search circular fitted inverted link icon"
        ></sui-input>
        <div class="invite-join-team" v-if="invites.length">
          <span>Bạn có {{ invites.length }} lời mời tham gia nhóm. </span>
          <span class="show-invites-modal" @click="showInvitesModal"
            >Bấm vào đây để xem</span
          >
        </div>
      </div>
    </div>
    <div class="row text-no-team" v-if="Object.keys(teamList).length === 0">
      <span>Không tìm thấy nhóm nào phù hợp với kết quả tìm kiếm</span>
    </div>
    <div v-for="(groupTeambyStatus, status, index) in teamList" :key="index">
      <h2>{{ status }}</h2>
      <div class="row">
        <div
          class="col-12 col-lg-6 team"
          v-for="(team, index) in groupTeambyStatus"
          :key="index"
        >
          <div class="team-container">
            <img
              :src="require(`./../assets/img/${team.avatar}`)"
              alt="Avatar"
              class="image"
              style="width: 100%"
            />
            <p class="team-name">{{ team.teamName }}</p>
            <div class="middle">
              <div class="update-text" @click="updateTeam(team)">Chỉnh sửa</div>
              <div class="text" @click="goToTeam(team.teamId)">Xem</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InvitesModal from "../components/teams/InvitesModal.vue";
import AddTeam from "../components/teams/AddTeam.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      keyword: "",
      teamList: {},
      teamTypeList: [],
    };
  },

  computed: {
    ...mapGetters({
      teams: "teamList",
      invites: "inviteList",
    }),
  },

  methods: {
    ...mapActions({
      getTeamList: "getTeamList",
      getInviteList: "getInviteList",
    }),

    getTeamAvatar(teamAvatar) {
      return require("./../assets/img/" + teamAvatar);
    },

    goToTeam(id) {
      this.$router.push("/team/" + id);
    },

    createNewTeam() {
      this.$modal.show(
        AddTeam,
        {
          isUpdate: false,
          typeList: this.teamTypeList,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 600,
          height: "auto",
        }
      );
    },

    updateTeam(team) {
      this.$modal.show(
        AddTeam,
        {
          targetTeam: team,
          isUpdate: true,
          typeList: this.teamTypeList,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 600,
          height: "auto",
        }
      );
    },

    prepareTeamList(teams) {
      this.teamList = {};
      teams.forEach((team) => {
        const teamType = team.type;
        if (this.teamList[teamType]) {
          this.teamList[teamType].push(team);
        } else {
          this.teamList[teamType] = [];
          this.teamList[teamType].push(team);
        }
      });
    },

    getTypeList(teams) {
      this.teamTypeList = [];
      teams.forEach((team) => {
        const teamType = team.type;
        if (!this.teamTypeList.includes(teamType)) {
          this.teamTypeList.push(teamType);
        }
      });
    },

    searchTeam(keyword) {
      const teams = this.teams.filter((team) => {
        if (team.teamName.toLowerCase().includes(keyword.toLowerCase())) {
          console.log("true");
          return true;
        }
        return false;
      });

      this.prepareTeamList(teams);
    },

    showInvitesModal() {
      this.$modal.show(
        InvitesModal,
        {
          isUpdate: true,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 600,
          height: 600,
        }
      );
    },
  },

  async created() {
    await this.getTeamList();
    await this.getInviteList();
    this.getTypeList(this.teams);
  },

  watch: {
    keyword(keyword) {
      this.searchTeam(keyword);
    },

    teams(newTeams) {
      this.prepareTeamList(newTeams);
      this.getTypeList(newTeams);
    },

    invites() {
      this.getTeamList();
    },
  },
};
</script>

<style lang="scss" scoped>
#teams-page {
  padding: 1rem 1rem 0;

  .team {
    margin-bottom: 1rem;

    .team-container {
      width: 84%;
      height: 100%;
      margin: 0;
      border-radius: 5px;
      position: relative;
      box-shadow: 0 1px 4px rgba(9, 30, 66, 0.25),
        0 0 8px 1px rgba(9, 30, 66, 0.08);
      cursor: pointer;
    }

    .image {
      opacity: 1;
      display: block;
      width: 100%;
      max-height: 200px;
      height: auto;
      transition: 0.5s ease;
      backface-visibility: hidden;
      border-radius: 5px;
    }

    .middle {
      transition: 0.5s ease;
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
      min-width: 120px;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
      color: #333;
      background-image: url('~@/assets/img/bg_noodles.png');
      background-size: cover;
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

  // .create-new-team {
  //   width: 80%;
  //   height: 200px;
  //   margin: 0 auto;
  //   border-radius: 5px;
  //   position: relative;
  //   box-shadow: 0 1px 4px rgba(9, 30, 66, 0.25),
  //     0 0 8px 1px rgba(9, 30, 66, 0.08);
  //   cursor: pointer;
  //   font-size: 25px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;

  //   &:hover {
  //     transition: 0.5s ease;
  //     color: white;
  //     background: gray;
  //   }

  //   span {
  //     margin-left: 15px;
  //   }
  // }

  .row-header {
    display: flex;
    justify-content: space-between;
  }

  .create-new-team {
    width: 300px;
    padding: 5px 2rem;
    border-radius: 8px;
    font-size: 20px;
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

  .team-search {
    display: flex;
    flex-flow: column;
    width: 100%;
    margin: 0 36px;

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

  .invite-join-team {
    margin-top: 30px;
    font-weight: bold;

    .show-invites-modal {
      color: #026aa7;

      &:hover {
        color: blue;
        cursor: pointer;
      }
    }
  }
}
</style>
