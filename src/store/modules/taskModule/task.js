import axios from "axios";

const state = {
    taskList: {}
}

const getters = {
    taskList: (state) => {
        return state.taskList
    }
}

const mutations = {
    updateTaskList: (state, tasksData) => {
        state.taskList = tasksData
    }
}

const actions = {
    getTaskList: async({ commit }, teamId) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            const response = await axios.get(`${process.env.VUE_APP_API_HOST}/task/getalltasks/${teamId}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })

            commit('updateTaskList', response.data)
        } catch (error) {
            console.log(error.response.data);
        }
    },

    createTismTask: async({ dispatch }, { teamId, taskName, taskType, startTime, endTime, description, executor }) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            const response = await axios.post(`${process.env.VUE_APP_API_HOST}/task/createtask`, { teamId, taskName, taskType, startTime, endTime, description, executor }, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            })

            console.log(response.data)
            if (response.data.taskId) {
                await dispatch('getTaskList')
            }
            return response.data
        } catch (error) {
            // statements
            console.log(error.response.data);
        }
    },

    updateTismTask: async({ dispatch }, { teamId, taskId, taskName, taskType, startTime, endTime, description, executor }) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            const response = await axios.put(`${process.env.VUE_APP_API_HOST}/task/updatetask`, { taskId, taskName, taskType, startTime, endTime, description, executor }, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            })

            if (response.data.success) {
                await dispatch('getTaskList', teamId)
            }
            return response.data
        } catch (error) {
            // statements
            console.log(error.response.data);
        }
    },

    updateTismTaskType: async({ dispatch }, { teamId, taskId, taskType }) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            const response = await axios.put(`${process.env.VUE_APP_API_HOST}/task/updatetasktype`, { taskId, taskType }, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            })

            if (response.data.success) {
                await dispatch('getTaskList', teamId)
            }
            return response.data
        } catch (error) {
            // statements
            console.log(error.response.data);
        }
    },

    deleteTismTask: async({ dispatch }, taskId) => {
        const accessToken = localStorage.getItem('accessToken')

        try {
            await axios.delete(`${process.env.VUE_APP_API_HOST}/task/${taskId}/removetask`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            })

            await dispatch('getTaskList')
        } catch (error) {
            // statements
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