<template>
  <div id="teams-page" class="container">
    <h2>Team công khai</h2>
    <div class="row">
      <div class="col-12 col-lg-6 team" v-for="(team, index) in teams" :key="index">
        <div class="team-container">
          <img :src="require(`./../assets/img/${team.avatar}`)" alt="Avatar" class="image" style="width:100%">
          <p class="team-name">{{ team.name }}</p>
          <div class="middle">
            <div class="text" @click="goToTeam(team.id)">Xem</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6 team">
        <div class="create-new-team" @click="createNewTeam">
          <i class="fa-solid fa-circle-plus"></i>
          <span>Tạo mới Team công khai của bạn</span>
        </div>
      </div>
    </div>
    <h2>Team riêng tư</h2>
    <div class="row">
      <div class="col-12 col-lg-6 team" v-for="(team, index) in teams" :key="index">
        <div class="team-container">
          <img :src="require(`./../assets/img/${team.avatar}`)" alt="Avatar" class="image" style="width:100%">
          <p class="team-name">{{ team.name }}</p>
          <div class="middle">
            <div class="text" @click="goToTeam(team.id)">Xem</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6 team">
        <div class="add-new-team" @click="createNewTeam">
          <i class="fa-solid fa-circle-plus"></i>
          <span>Tạo mới Team riêng tư của bạn</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddTeam from '../components/teams/AddTeam.vue'

export default {
  data() {
    return {
      teams: [
        {
          id: 1,
          name: "teams 1",
          avatar: 'login-background-1.jpg'
        },
        {
          id: 2,
          name: "teams 2",
          avatar: "login-background-1.jpg"
        },
        {
          id: 3,
          name: "teams 3",
          avatar: "login-background-1.jpg"
        },
        {
          id: 4,
          name: "teams 4",
          avatar: "login-background-1.jpg"
        },
        {
          id: 5,
          name: "teams 5",
          avatar: "login-background-1.jpg"
        },
        {
          id: 6,
          name: "teams 6",
          avatar: "login-background-1.jpg"
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
}
</style>
