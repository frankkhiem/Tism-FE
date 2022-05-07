<template>
  <div class="home-card">
    <div class="card__image">
      <img :src="image" alt="">
    </div>
    <div class="card__title">
      {{ title }}
    </div>
    <div class="card-description">
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    title: String,
    description: String
  }
}
</script>

<style lang="scss" scoped>
.home-card {

}
</style>