<template>
  <div class="contacts-page">
    <PageTitle></PageTitle>
    <PageNav></PageNav>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axios from 'axios'
import PageTitle from '@/components/contactsPage/PageTitle'
import PageNav from '@/components/contactsPage/PageNav'

export default {
  components: {
    PageTitle,
    PageNav
  },

  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      user: 'profile',
    }),
  },
  methods: {
    ...mapMutations({
      updateUser: 'updateUser',
    }),

    ...mapActions({
      getSyncContacts: 'getSyncContacts',
      getGoogleContacts: 'getGoogleContacts',
      refreshGoogleContacts: 'refreshGoogleContacts',
      getOutlookContacts: 'getOutlookContacts',
      refreshOutlookContacts: 'refreshOutlookContacts',
    }),

    async handleAfterAuth() {
      let query = this.$route.query;
      if( query.type === 'linkingOutlook' ) {
        if( query.data && query.data.code ) {
          try {
            await axios.post(process.env.VUE_APP_ZATO_ESB_MODULE_HOST + '/outlook/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.data.code
            })
          } catch(error) {
            console.log(error)
          } finally {
            this.refreshOutlookContacts()
            this.$router.replace({ name: 'OutlookContacts' })
          }
        }
        else {
          alert('Loi lien ket Outlook');
        }
      }
      else if( query.type === 'linkingGoogle' ) {
        if( query.data && query.data.code ) {
          try {
            await axios.post(process.env.VUE_APP_ZATO_ESB_MODULE_HOST + '/google/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.data.code
            })
          } catch(error) {
            console.log(error)
          } finally {
            this.refreshGoogleContacts()
            this.$router.replace({ name: 'GoogleContacts' })
          }
        }
        else {
          alert('Loi lien ket Google');
        }
      }
    },
  },

  created() {
    this.getSyncContacts()
    this.getGoogleContacts()
    this.getOutlookContacts()
  },

  mounted() {
    if( this.$route.query.type ) {
      this.handleAfterAuth();
    }
    else {
      // console.log('Khong co yeu cau lien ket nao');
    }
  }
}
</script>
<style lang="scss" scoped>

</style>