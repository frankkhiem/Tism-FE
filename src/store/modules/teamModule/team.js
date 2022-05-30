import axios from "axios";

const state = {
 team: {}
}

const getters = {
  team: (state) => {
    return state.team
  }
}

const mutations = {
  teamInfo: (state, team) => {
    state.team = team
  }
}

const actions = {
  getTeam: async ({ commit }, teamId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/getteam/${teamId}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('teamInfo', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
