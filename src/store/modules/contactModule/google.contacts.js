import axios from 'axios'

const state = {
  googleContacts: {}
}

const getters = {
  googleContacts: (state) => {
    return state.googleContacts
  }
}

const mutations = {
  updateGoogleContacts: (state, contactData) => {
    state.googleContacts = contactData
  },
}

const actions = {
  getGoogleContacts: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/google/contacts`, {
        params: {
          accessToken
        }
      })

      commit('updateGoogleContacts', response.data)
    } catch(error) {
      // statements
      console.log(error.response.data);
    }
  },

  refreshGoogleContacts: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/google/load-contacts`, {
        accessToken
      })

      if( response.data.success ) dispatch('getGoogleContacts')
    } catch(error) {
      // statements
      console.log(error.response.data)
    }
  },

  googleUnlink: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/google/unlink`, {
        params: {
          accessToken
        }
      })

      if( response.data.success ) dispatch('getGoogleContacts')
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