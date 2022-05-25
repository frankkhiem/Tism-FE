const state = {

}

const getters = {

}

const mutations = {

}

const audios = {
  newMessageSound: new Audio(`${location.protocol}//${location.host}/sounds/new_facebook_notify.mp3`),
  ringTone1: new Audio(`${location.protocol}//${location.host}/sounds/nhac-cho-video-call.mp3`),
  ringTone2: new Audio(`${location.protocol}//${location.host}/sounds/nhac-chuong-video-call.mp3`)
}

const actions = {
  playMessageSound: () => {
    audios.newMessageSound.play()
  },

  playRingTone1: () => {
    audios.ringTone1.loop = true
    audios.ringTone1.currentTime = 0
    audios.ringTone1.play()
  },

  stopRingTone1: () => {
    audios.ringTone1.pause()
  },

  playRingTone2: () => {
    audios.ringTone2.loop = true
    audios.ringTone2.currentTime = 0
    audios.ringTone2.play()
  },

  stopRingTone2: () => {
    audios.ringTone2.pause()
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
