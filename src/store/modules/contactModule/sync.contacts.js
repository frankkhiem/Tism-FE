import axios from 'axios'

const state = {
  syncContacts: {}
}

const getters = {
  tismContacts: (state) => {
    return state.syncContacts
  }
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
  },

  syncContacts: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/sync-contacts`, {
        params: {
          accessToken
        }
      })

      await dispatch('getSyncContacts')
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },

  deleteContact: async ({ dispatch }, phoneName) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.delete(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/contact`, {
        params: {
          accessToken,
          phoneName: phoneName
        }
      })

      await dispatch('getSyncContacts')
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },

  deleteMultipleContacts: async ({ dispatch }, listPhoneNames) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.post(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/contact/delete-multiple`, {
        accessToken,
        listPhoneNames
      })

      await dispatch('getSyncContacts')
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