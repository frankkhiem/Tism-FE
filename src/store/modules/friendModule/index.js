import axios from 'axios'

import listFriends from './list.friends'
import invitationsFriends from './invitations.friends'
import findFriends from './find.friends'
import personInfo from './person.info'

const state = {
  
}

const getters = {

}

const mutations = {
  nothingFriendAction: () => {

  }
}

const actions = {
  sendInvitationFriend: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.post(`${process.env.VUE_APP_API_HOST}/friends/invitation`, 
      {
        personId
      }, 
      { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingFriendAction')
    } catch(error) {
      console.log(error.response.data);
    }
  },

  cancelInvitationFriend: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.delete(`${process.env.VUE_APP_API_HOST}/friends/invitation/${personId}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingFriendAction')
    } catch(error) {
      console.log(error.response.data);
    }
  },

  declineInvitationFriend: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.delete(`${process.env.VUE_APP_API_HOST}/friends/invitation/${personId}/decline`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingFriendAction')
    } catch(error) {
      console.log(error.response.data);
    }
  },

  acceptInvitationFriend: async ({ commit }, personId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.post(`${process.env.VUE_APP_API_HOST}/friends/accept`, 
      {
        personId
      },
      { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingFriendAction')
    } catch(error) {
      console.log(error.response.data);
    }
  },

  unFriend: async ({ commit }, friendId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.delete(`${process.env.VUE_APP_API_HOST}/friends/${friendId}/unfriend`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingFriendAction')
    } catch(error) {
      console.log(error.response.data);
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  modules: {
    listFriends,
    invitationsFriends,
    findFriends,
    personInfo
  }
}
