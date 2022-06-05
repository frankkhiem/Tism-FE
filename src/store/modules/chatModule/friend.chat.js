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

    return conversations.sort((item1, item2) => {
      if( item1.lastUpdated > item2.lastUpdated  ) return -1;
      else return 1;
    })
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

 updateFriendStatusInConversationSelected: (state, data) => {
    state.conversation.friendStatus = data
  },

  addSendedMessage: (state, message) => {
    if( state.conversation.conversationId !== message.friendship ) return
    state.conversation.messages.push(message)
    state.conversation.totalMessages++
    let lastMessage = {}

    if( message.type === 'image' ) {
      lastMessage.content = 'Ảnh gửi lên.'
    } else if( message.type === 'file' ) {
      lastMessage.content = 'Tệp đính kèm.'
    } else {
      lastMessage.content = message.content
    }
    lastMessage.type = message.type

    for (let conversation of state.listConversations) {
      if( conversation.conversationId === message.friendship ) {
        conversation.lastMessage = lastMessage
        conversation.lastUpdated = message.createdAt
        break
      }
    }
  },

  addOlderMessages: (state, messages) => {
    state.conversation.messages.unshift(...messages)
  },

  updateSeenTagConversation: (state, { conversationId, seen }) => {
    for (let conversation of state.listConversations) {
      if( conversation.conversationId === conversationId ) {
        conversation.isSeen = seen
        break
      }
    }
  },

  receiveNewMessageToConversation: (state, { conversationId, message, lastUpdated }) => {
    if( state.conversation.conversationId === conversationId ) {
      state.conversation.totalMessages++
    }
    for (let conversation of state.listConversations) {
      if( conversation.conversationId === conversationId ) {
        conversation.isSeen = false
        conversation.lastMessage = message
        conversation.lastUpdated = lastUpdated
        break
      }
    }
  },

  removeDeletedMessage: (state, deletedMessage) => {
    if( state.conversation.conversationId !== deletedMessage.friendship ) return
    state.conversation.totalMessages--
    for( let i = 0; i < state.conversation.messages.length; i++ ) {
      let message = state.conversation.messages[i]
      if( message._id === deletedMessage._id ) {
        state.conversation.messages.splice(i, 1)
        break
      }
    }
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
        headers: {"Authorization": `Bearer ${accessToken}`}
      })

      commit('updateConversationSelected', response.data.conversation)
    } catch(error) {
      console.log(error.response.data)
      throw error
    }
  },

  sendTextMessage: async ({ commit, dispatch }, { conversationId, content })  => {
    dispatch('seenConversation', conversationId)

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
  },

  sendImageMessage: async ({ commit }, { conversationId, formData })  => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/image-message`, formData, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      commit('addSendedMessage', response.data.message)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  sendFileMessage: async ({ commit }, { conversationId, formData })  => {
    const accessToken = localStorage.getItem('accessToken')
    
    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/file-message`, formData, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      commit('addSendedMessage', response.data.message)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  seenConversation: async ({ commit }, conversationId) => {
    commit('updateSeenTagConversation', { conversationId, seen: true })
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.patch(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/seen`, {}, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })
    } catch(error) {
      console.log(error.response.data);
    }
  },

  unSeenConversation: async ({ commit }, conversationId) => {
    commit('updateSeenTagConversation', { conversationId, seen: false })
    const accessToken = localStorage.getItem('accessToken')

    try {
      await axios.patch(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/unseen`, {}, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })
    } catch(error) {
      console.log(error.response.data);
    }
  },

  receiveNewMessage: async ({ commit }, { conversationId, newMessage, lastUpdated }) => {
    commit('receiveNewMessageToConversation', {
      conversationId,
      message: newMessage,
      lastUpdated
    })
  },

  changeConversationStatus: async ({ state, commit, dispatch }) => {
    if( !state.conversation.friendId ) return
    const friendStatus = await dispatch('getPersonStatus', state.conversation.friendId)
    commit('updateFriendStatusInConversationSelected', friendStatus)
  },

  getOlderMessages: async ({ commit }, { conversationId, skip, take }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/messages`, {
        headers: {"Authorization" : `Bearer ${accessToken}`},
        params: {
          skip,
          take
        }
      })
      commit('addOlderMessages', response.data.messages)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  deleteMessage: async ({ commit, dispatch }, { conversationId, messageId }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.delete(`${process.env.VUE_APP_API_HOST}/conversations/${conversationId}/messages/${messageId}`, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('removeDeletedMessage', response.data.deletedMessage)
      dispatch('getListConversations')
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
