const axios = require('axios')

const state = {
  personInfo: {
    name: 'Unknown',
    email: 'example@host.com',
    friendship: 'stranger',
    mutualFriends: 0
  },
  mutualFriends: []
}

const getters = {
  person: (state) => {
    return {
      ...state.personInfo,
      firstNameLetter: state.personInfo.name?.split(' ').pop().slice(0, 1).toUpperCase() || 'A'
    }
  },

  listMutualFriends: (state) => {
    const friends = state.mutualFriends.map((friend) => {
      const firstNameLetter = friend.name.split(' ').pop().slice(0, 1).toUpperCase()
      return {
        ...friend,
        firstNameLetter
      }
    })
    return friends
  }
}

const mutations = {
  updatePersonInfo: (state, personInfo) => {
    state.personInfo = personInfo
  },

  updateMutualFriends: (state, mutualFriends) => {
    state.mutualFriends = mutualFriends
  }
}

const actions = {
  getPersonInfo: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/person/${personId}/info`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updatePersonInfo', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  }, 

  getMutualFriends: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/person/${personId}/mutual-friends`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateMutualFriends', response.data)
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
