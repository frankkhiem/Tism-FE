import axios from 'axios'

const state = {
  user: {}
}

const getters = {
  userAuthenticated: (state) => {
    if (Object.keys(state.user).length === 0 && Object.getPrototypeOf(state.user) === Object.prototype)
      return false
    return true
  },

  profile: (state) => {
    return state.user
  }
}

const mutations = {
  updateUser: (state, userData) => {
    state.user = userData
  },

  logoutUser: (state) => {
    state.user = {}
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
};

const actions = {
  fetchUserProfile: async ({ commit, dispatch }) => {
    if (localStorage.getItem('accessToken') === null) {
      const isRefreshToken = await dispatch('refreshToken')

      if( isRefreshToken ) await dispatch('fetchUserProfile')
      else commit('logoutUser')
      return
    }

    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/user/profile`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`} 
      })

      commit('updateUser', response.data)
    } catch(error) {
      // statements
      // console.log(error.response)
      try {
        const isRefreshToken = await dispatch('refreshToken')

        if( isRefreshToken ) await dispatch('fetchUserProfile')
        else commit('logoutUser')
      } catch(error) {
        // statements
        console.log(error);
      }
    }
  },

  refreshToken: async () => {
    if (localStorage.getItem('refreshToken') === null) {
      return false
    }

    const refreshToken = localStorage.getItem('refreshToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/refresh-token`, { 
        refreshToken
      })

      localStorage.setItem('accessToken', response.data.accessToken)      
      localStorage.setItem('refreshToken', response.data.refreshToken)

      return true
    } catch(error) {
      // statements
      // console.log(error.response);
      return false
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}