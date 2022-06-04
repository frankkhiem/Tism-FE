import axios from 'axios'

const state = {
  taskList: {}
}

const getters = {
  taskList: (state) => {
    return state.taskList
  }
}

const mutations = {
  updateTaskList: (state, taskData) => {
    state.taskList = taskData
  }
};

const actions = {
  getTaskList: async ({ commit }, teamId) => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_HOST}/task/getalltasks/${teamId}`, {
        headers: {"Authorization" : `Bearer ${accessToken}`}
      })

      commit('updateTaskList', response.data)
    } catch(error) {
      console.log(error.response.data);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}
