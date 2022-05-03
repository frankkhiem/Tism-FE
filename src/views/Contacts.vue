<template>
  <div class="profile">
    <h1>Trang hiển thị danh bạ cá nhân</h1>
    <div class="user-info">
      <h3>Đây là tài khoản của {{ user.fullname }}</h3>
    </div>
    <div class="account">
      <div class="google">
        <h4>Tài khoản Google của bạn:</h4>
        <button v-if="!user.linkedGoogle && !google.linking" @click="getAuthGoogle">Google</button>
        <p v-else-if="google.linking">Đang tiến hành liên kết Google</p>
        <p v-else>Google đã được liên kết</p>
        <br>
        <button @click="refreshGoogleContacts">Refresh Google Contacts</button>
      </div>
      <div class="outlook">
        <h4>Tài khoản Outlook của bạn:</h4>
        <button v-if="!user.linkedOutlook && !outlook.linking" @click="getAuthOutlook">Outlook</button>
        <p v-else-if="outlook.linking">Đang tiến hành liên kết Outlook</p>
        <p v-else>Outlook đã được liên kết</p>
        <br>
        <button @click="refreshOutlookContacts">Refresh Outlook Contacts</button>
      </div>
    </div>

    
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      google: {
        linking: false,
      },
      outlook: {
        linking: false,
      }
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
    
    async getAuthOutlook() {
      console.log('Lien ket outlook')
      
      let url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=e63fb652-b80d-439f-a487-87dc8ea3bd7b&response_type=code&redirect_uri=http://localhost:8080/outlook/get-auth-code&scope=User.Read User.ReadWrite Contacts.Read Contacts.ReadWrite offline_access&response_mode=query`
      window.location.href = url
    },

    async handleAfterAuth() {
      let query = this.$route.query;
      if( query.type === 'linkingOutlook' ) {
        if( query.data && query.data.code ) {
          this.outlook.linking = true;
          console.log('Gui outlook code toi zato module');
          console.log(query.data.code);
          try {
            let response = await axios.post(process.env.VUE_APP_ZATO_ESB_MODULE_HOST + '/outlook/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.data.code
            });
            if( response.status === 200 ) {
              this.user.linkedOutlook = true;
              this.updateUser(this.user);            }
          } catch(error) {
            // statements
            console.log(error);
          }
          this.outlook.linking = false;
          this.$router.replace({ name: 'Contacts' });
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
          this.$router.replace({ name: 'Contacts' });
        }
        else {
          alert('Loi lien ket Google');
        }
      }
    },
    applyZaloAvatar() {
      this.user.avatar = this.zalo.avatar;
      this.updateProfile();
    },
    async updateProfile() {
      try {
        let response = await axios.put(this.$backendHost + '/profile', this.user, {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });
        
        if( response.status === 200 ) {
          this.updateUser(this.user);
        }
      } catch(e) {
        // statements
        console.log(e);
      }
    }
  },
  created() {
    this.getSyncContacts()
    this.getGoogleContacts()
    this.getOutlookContacts()

    setTimeout( async () => {
      if( this.user.linkedZalo === true ) {
        try {
          let response = await axios.post(this.$backendHost + '/zalo/load-profile', {
            accessToken: localStorage.getItem('accessToken')
          });
          if( response.status === 200 ) {
            this.zalo.name = response.data.zaloName;
            this.zalo.avatar = response.data.zaloAvatar;
          }
          this.zalo.loading = false;
        } catch(error) {
          // statements
          console.log(error);
        }
      }
    }, 1000);
  },
  mounted() {
    if( this.$route.query.type ) {
      this.handleAfterAuth();
    }
    else {
      console.log('Khong co yeu cau lien ket nao');
    }
  }
}
</script>
<style>
.user-info {
  margin: 30px 0;
}
.account {
  margin: 30px 0;
}
.account h4 {
  margin-bottom: 10px;
}
.google {
  margin-bottom: 3rem;
}
.outlook {
  margin-bottom: 3rem;
}
</style>