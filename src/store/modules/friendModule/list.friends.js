import axios from 'axios'

const state = {
	listFriends: []
}

const getters = {
	allFriends: (state) => {
		const friends = state.listFriends.map((friend) => {
			const firstNameLetter = friend.name.split(' ').pop().slice(0, 1).toUpperCase()
			return {
				...friend,
				history: new Date(friend.history).toLocaleDateString('en-GB'),
				firstNameLetter
			}
		})
		return friends
	},

	onlineFriends: (state) => {
		const friends = state.listFriends
			.filter((friend) => {
				return friend.status === 'online'
			})
			.map((friend) => {
				const firstNameLetter = friend.name.split(' ').pop().slice(0, 1).toUpperCase()
				return {
					id: friend.id,
					name: friend.name,
					avatar: friend.avatar,
					status: friend.status,
					chatRoomId: friend.chatRoomId,
					firstNameLetter
				}
			})
		return friends.sort((friend1, friend2) => {
			return friend1.name.localeCompare(friend2.name)
		})
	}
}

const mutations = {
	updateListFriends: (state, friends) => {
		state.listFriends = friends
	}
}

const actions = {
	getListFriends: async ({ commit }) => {
		const accessToken = localStorage.getItem('accessToken')

		try {
			const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateListFriends', response.data)
		} catch(error) {
			console.log(error.response.data);
		}
	},

	searchCurrentFriends: async ({ commit }, keyword) => {
		const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/friends/search?keyword=${keyword}`, { 
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateListFriends', response.data)
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