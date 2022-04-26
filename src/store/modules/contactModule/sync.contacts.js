import axios from 'axios'

const state = {
  syncContacts: {}
}

const getters = {
  
}

const mutations = {
  updateSyncContacts: (state, contactData) => {
    state.syncContacts = contactData
  },
}

const actions = {
  getSyncContacts: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/contacts`, {
        params: {
          accessToken
        }
      })

      commit('updateSyncContacts', response.data)
    } catch(error) {
      // statements
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