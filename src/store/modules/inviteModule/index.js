import axios from 'axios'

const state = {
  inviteList: {}
}

const getters = {
  inviteList: (state) => {
    return state.inviteList
  }
}

const mutations = {
  updateInviteList: (state, inviteData) => {
    state.inviteList = inviteData
  }
};

const actions = {
  getInviteList: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/getallinvite`, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateInviteList', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  refuseInvite: async ({ dispatch }, inviteId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.patch(`${process.env.VUE_APP_API_HOST}/team/responseinvite`, { inviteId, accept: "false" },  {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      },
      )
      await dispatch('getInviteList')
    } catch(error) {
      console.log(error.response.data);
    }
  },

  acceptInvite: async ({ dispatch }, inviteId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.patch(`${process.env.VUE_APP_API_HOST}/team/responseinvite`, { inviteId, accept: "true" },  {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      },
      )
      await dispatch('getInviteList')
    } catch(error) {
      console.log(error.response.data);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
