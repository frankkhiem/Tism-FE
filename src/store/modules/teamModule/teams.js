import axios from "axios";

const state = {
 teamList: {}
}

const getters = {
 teamList: (state) => {
  return state.teamList
 }
}

const mutations = {
 updateTeamList: (state, teamsData) => {
  state.teamList = teamsData
 }
}

const actions = {
  getTeamList: async ({ commit }) => {
  const accessToken = localStorage.getItem('accessToken')

  try {
    const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/getallteam`, {
      headers: {"Authorization" : `Bearer ${accessToken}`}
    })

    commit('updateTeamList', response.data)
  } catch(error) {
    console.log(error.response.data);
  }
  },

  createTismTeam: async ({ dispatch }, { teamName, type, avatar }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/team/newteam`, { teamName, type, avatar }, {
        headers: {"Authorization" : `Bearer ${accessToken}`},
      })

      console.log(response.data)
      if( response.data.teamId ) {
        await dispatch('getTeamList')
      }
      return response.data
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },

  updateTismTeam: async ({ dispatch }, { teamId, teamName, type, avatar }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.put(`${process.env.VUE_APP_API_HOST}/team/updateteam`, { teamId, teamName, type, avatar }, {
        headers: {"Authorization" : `Bearer ${accessToken}`},
      })

      if( response.data.success ) {
        await dispatch('getTeamList')
      }
      return response.data
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },

  deleteTismTeam: async ({ dispatch }, teamId) => {
    console.log('khanh')
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.delete(`${process.env.VUE_APP_API_HOST}/team/${teamId}/removeteam`, {
        headers: {"Authorization" : `Bearer ${accessToken}`},
      })

      await dispatch('getTeamList')
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
