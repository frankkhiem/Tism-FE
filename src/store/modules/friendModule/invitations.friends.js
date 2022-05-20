import axios from 'axios'

const state = {
	invitationsReceived: [],
	invitationsSended: []
}

const getters = {
	friendsInvitationsReceived: (state) => {
		const friends = state.invitationsReceived.map((friend) => {
			const firstNameLetter = friend.name.split(' ').pop().slice(0, 1).toUpperCase()
			return {
				...friend,
				firstNameLetter
			}
		})
		return friends
	},

	friendsInvitationsSended: (state) => {
		const friends = state.invitationsSended.map((friend) => {
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
	updateInvitationsReceived: (state, newData) => {
		state.invitationsReceived = newData
	},

	updateInvitationsSended: (state, newData) => {
		state.invitationsSended = newData
	}
}

const actions = {
	getInvitationsReceived: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

		try {
			const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/invitations-received`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateInvitationsReceived', response.data)
		} catch(error) {
			console.log(error.response.data);
		}
	},

	getInvitationsSended: async ({ commit }) => {
    const accessToken = localStorage.getItem('accessToken')

		try {
			const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/invitations-sended`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateInvitationsSended', response.data)
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