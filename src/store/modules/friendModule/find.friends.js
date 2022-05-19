import axios from 'axios'

const state = {
  findFriends: []
}

const getters = {
  allResultFindFriends: (state) => {
    const friends = state.findFriends.map((friend) => {
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
  updateFindFriends: (state, findResult) => {
    state.findFriends = findResult
  }
}

const actions = {
  resetFindFriends: ({ commit }) => {
    commit('updateFindFriends', [])
  },

  searchFindFriends: async ({ commit }, keyword) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/find?keyword=${keyword}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateFindFriends', response.data)
    } catch(error) {
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