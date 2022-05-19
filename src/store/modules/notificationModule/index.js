const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  playMessageSound: () => {
    const url = `${location.protocol}//${location.host}/sounds/new_facebook_notify.mp3`
    // console.log(url)
    const audio = new Audio(url)
    audio.play();
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
