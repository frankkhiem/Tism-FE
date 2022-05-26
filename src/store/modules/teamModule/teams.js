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
    const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/`, {
      params: {
        accessToken
      }
    })

    commit('updateTeamList', response.data)
  } catch(error) {
    console.log(error.response.data);
  }
  },

  createTeam: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/contact`, {
        accessToken,
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

  updateTeam: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.put(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}`, {
        accessToken,
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
}

export default {
  state,
  getters,
  mutations,
  actions
}
