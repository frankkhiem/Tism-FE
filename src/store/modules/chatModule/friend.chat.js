import axios from 'axios'

const state = {
  listConversations: [],
  conversation: {}
}

const getters = {
  listConversations: (state) => {
    const conversations = state.listConversations.map((conversation) => {
      const friendFirstName = conversation.friendFullName?.split(' ').pop()
      const friendFirstNameLetter = friendFirstName?.slice(0, 1).toUpperCase()
      return {
        ...conversation,
        friendFirstName,
        friendFirstNameLetter
      }
    })

    return conversations
  },

  conversationSelected: (state) => {
    const friendFirstName = state.conversation.friendFullName?.split(' ').pop()
    const friendFirstNameLetter = friendFirstName?.slice(0, 1).toUpperCase()
    return {
      ...state.conversation,
      friendFirstName,
      friendFirstNameLetter
    }
  }
}

const mutations = {
  updateListConversations: (state, data) => {
    state.listConversations = data
  },

  updateConversationSelected: (state, data) => {
    state.conversation = data
  },

  addSendedMessage: (state, message) => {
    state.conversation.messages.push(message)
  }
}

const actions = {
  getListConversations: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/conversations`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateListConversations', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  getConversation: async ({ commit }, conversationId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateConversationSelected', response.data.conversation)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  sendTextMessage: async ({ commit }, { conversationId, content })  => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/text-message`, { 
        content
      }, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('addSendedMessage', response.data.message)
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
