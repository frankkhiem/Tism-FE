import axios from "axios";

const state = {
 team: {},
 members: []
}

const getters = {
  team: (state) => {
    return state.team
  },

  members: (state) => {
    const members = state.members.map((member) => {
      const firstName = member.name?.split(' ').pop()
      const firstNameLetter = firstName?.slice(0, 1).toUpperCase()
      return {
        ...member,
        firstName,
        firstNameLetter
      }
    })
    return members
  }
}

const mutations = {
  teamInfo: (state, team) => {
    state.team = team
  },

  updateMembers: (state, members) => {
    state.members = members
  },

  nothingTeamAction: () => {}
}

const actions = {
  getTeam: async ({ commit }, teamId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/getteam/${teamId}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('teamInfo', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  getMembersInfo: async ({ commit }, teamId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/${teamId}/members`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateMembers', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  },

  getRecentTeamMessages: async ({ commit }, { teamId, skip, take }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/team/${teamId}/messages`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`},
        params: {
          skip,
          take
        }
      })

      if( response.data.success ) {
        commit('nothingTeamAction')
        return response.data
      }
    } catch(error) {
      console.log(error.response.data);
    }
  },

  sendTeamTextMessage: async ({ commit }, { teamId, content }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/team/${teamId}/text-message`, 
      {
        content
      }, 
      { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      if( response.data.success ) {
        commit('nothingTeamAction')
        return response.data.message
      }
    } catch(error) {
      console.log(error.response.data);
    }
  },

  sendTeamImageMessage: async ({ commit }, { teamId, formData }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/team/${teamId}/image-message`, formData,
      { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      if( response.data.success ) {
        commit('nothingTeamAction')
        return response.data.message
      }
    } catch(error) {
      console.log(error.response.data);
    }
  },

  sendTeamFileMessage: async ({ commit }, { teamId, formData }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_HOST}/team/${teamId}/file-message`, formData,
      { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      if( response.data.success ) {
        commit('nothingTeamAction')
        return response.data.message
      }
    } catch(error) {
      console.log(error.response.data);
    }
  },

  deleteTeamMessage: async ({ commit }, { teamId, messageId }) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.delete(`${process.env.VUE_APP_API_HOST}/team/${teamId}/messages/${messageId}`, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('nothingTeamAction')
      if( response.data.success ) {
        return response.data.deletedMessage
      }
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
