// import axios from 'axios'

const state = {
	listFriends: [
		{
			id: 1,
			name: 'Abc xYz',
			avatar: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/279435045_3182937205320926_7759060444345737355_n.jpg?stp=dst-jpg_p200x200&_nc_cat=108&ccb=1-6&_nc_sid=7206a8&_nc_ohc=4_37b1xauGMAX9S7jHz&_nc_ht=scontent.fhan5-8.fna&oh=00_AT9mFAOG7j1kAdn_JcCq4udUcHdnLqOFFTXUiJlqzm_y5g&oe=627E9475',
			mutualFriends: 120,
			history: '05/09/2008',
			status: 'offline'
		},
		{
			id: 2,
			name: 'Nguyễn Gia Khiêm',
			avatar: 'https://scontent.fhan5-8.fna.fbcdn.net/v/t1.6435-9/197127135_2975771935976855_6443115520709624889_n.jpg?_nc_cat=110&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=pUt8PQsCsQsAX9L4zDd&_nc_ht=scontent.fhan5-8.fna&oh=00_AT8pWtZ2Z24rszVveg_wRW5cHvdEsX1lFSB0VT8xqFV7PA&oe=629D962C',
			mutualFriends: 146,
			history: '16/06/2000',
			status: 'online'
		},
		{
			id: 3,
			name: 'Huy  manh',
			avatar: '',
			mutualFriends: 12,
			history: '20/08/2018',
			status: 'online'
		},
		{
			id: 4,
			name: 'Bes Cam',
			avatar: '',
			mutualFriends: 32,
			history: '20/08/2018',
			status: 'offline'
		},
		{
			id: 5,
			name: 'Quốc khánh',
			avatar: 'https://scontent.fhan5-11.fna.fbcdn.net/v/t1.6435-9/181912464_2905594513019029_1678211643114449085_n.jpg?_nc_cat=111&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=hTZKifjQyV4AX_IY-0N&_nc_ht=scontent.fhan5-11.fna&oh=00_AT-n6drbSpUVRuPzkY9tH_aNXBUTjZ6YiOmbzdoZ5houaw&oe=62A0B7BD',
			mutualFriends: 20,
			history: '20/08/2018',
			status: 'online'
		},
		{
			id: 6,
			name: 'KHyM',
			avatar: '',
			mutualFriends: 435,
			history: '14/06/2000',
			status: 'offline'
		},
	]
}

const getters = {
	allFriends: (state) => {
		const friends = state.listFriends.map((friend) => {
			const firstNameLetter = friend.name.split(' ').pop().slice(0, 1).toUpperCase()
			return {
				...friend,
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
					firstNameLetter
				}
			})
		return friends
	}
}

const mutations = {

}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}