import axios from 'axios'

const state = {
  outlookContacts: {}
}

const getters = {
  outlookContacts: (state) => {
    return state.outlookContacts
  }
}

const mutations = {
  updateOutlookContacts: (state, contactData) => {
    state.outlookContacts = contactData
  },
}

const actions = {
  getOutlookContacts: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/outlook/contacts`, {
        params: {
          accessToken
        }
      })

      commit('updateOutlookContacts', response.data)
    } catch(error) {
      // statements
      console.log(error.response.data)
    }
  },

  refreshOutlookContacts: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/outlook/load-contacts`, {
        accessToken
      })

      if( response.data.success ) dispatch('getOutlookContacts')
    } catch(error) {
      // statements
      console.log(error.response.data)
    }
  },

  outlookUnlink: async ({ dispatch }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_ZATO_ESB_MODULE_HOST}/outlook/unlink`, {
        params: {
          accessToken
        }
      })

      if( response.data.success ) dispatch('getOutlookContacts')
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