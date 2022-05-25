<template>
  <div class="team-page">
    <TeamPageHeaderVue></TeamPageHeaderVue>
  </div>
</template>

<script>
import TeamPageHeaderVue from '../components/teams/team/TeamPageHeader'

export default {
  components: {
    TeamPageHeaderVue,
  }
}
</script>

<style lang="scss" scoped>
.team-page {
  background-image: url('./../assets/img/bg1.jpeg');
   background-repeat: no-repeat;
   background-size: cover;
}
</style>
