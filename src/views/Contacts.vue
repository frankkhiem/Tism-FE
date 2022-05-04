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
    
    async getAuthGoogle() {
      console.log('Lien ket google')

      let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=301608552892-g7inqpodo0dkvlvkmnaqrmpgf8oi695d.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/userinfo.email&redirect_uri=http://localhost:8080/google/get-auth-code&response_type=code&access_type=offline&prompt=select_account`

      window.location.href = url
    },

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
            // statements
            console.log(error);
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
          // this.outlook.linking = true;
          console.log('Gui google code toi zato module');
          console.log(query.data.code);
          try {
            let response = await axios.post(process.env.VUE_APP_ZATO_ESB_MODULE_HOST + '/google/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.data.code
            });
            if( response.status === 200 ) {
              this.user.linkedGoogle = true;
              this.updateUser(this.user);            }
          } catch(error) {
            // statements
            console.log(error);
          }
          this.outlook.linking = false;
          this.$router.replace({ name: 'GoogleContacts' });
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