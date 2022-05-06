<template>
  <div class="contacts-page__google">
    <ContactsTitle 
      :email="google.account"
      @google-refresh="googleRefresh"
      @google-sync="googleSync"
    ></ContactsTitle>
    <div v-if="loading" class="loading-page">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-if="!loading && !google.linked" class="account-link">
      <div class="account-link__intro">
        <h5>Bạn chưa liên kết <strong>Tism</strong> với tài khoản <strong>Google</strong> của mình</h5>
        <p>Nếu muốn đồng bộ danh bạ của bạn với Google, hãy kết nối ngay bây giờ!</p>
      </div>
      <div @click="accountLinking" class="account-link-btn">
        <img class="tism-logo" src="@/assets/img/IconPage.png" alt="Logo Tism">
        <i class="fa-solid fa-link"></i>
        <img class="google-logo" src="https://img.icons8.com/external-justicon-lineal-color-justicon/48/000000/external-google-social-media-justicon-lineal-color-justicon.png" alt="Logo Google">
      </div>
    </div>
    <div v-if="!loading && google.linked">
      <ContactsSearch @search-contacts="search"></ContactsSearch>
      <div class="contacts-count">
        Có {{ contactsCount }} liên hệ
      </div>
      <ListHeader></ListHeader>
      <ListContacts :contacts="listContacts"></ListContacts>
      <div class="unlink">
        <div class="unlink-btn" @click="unlink">
          <i class="fa-solid fa-link-slash"></i>
          Hủy liên kết Google
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContactsTitle from './ContactsTitle'
import ContactsSearch from './ContactsSearch'
import ListHeader from './ListHeader'
import ListContacts from './ListContacts'

export default {
  components: {
    ContactsTitle,
    ContactsSearch,
    ListHeader,
    ListContacts
  },

  computed: {
    ...mapGetters({
      google: 'googleContacts',
    }),
  },

  data() {
    return {
      listContacts: {},
      contactsCount: 0,
      loading: false
    }
  },

  methods: {
    ...mapActions({
      refreshGoogleContacts: 'refreshGoogleContacts',
      syncGoogleContacts: 'syncReverseGoogleContacts',
      googleUnlink: 'googleUnlink'
    }),

    search(keyword) {
      // console.log(keyword)
      const contacts = this.google.contacts.filter((contact) => {
        if( contact.phoneName.toLowerCase().includes(keyword.toLowerCase()) ) return true
        for (let i = 0; i < contact.phoneNumbers.length; i++) {
          if( contact.phoneNumbers[i].replace(/\s/g, '').includes(keyword.replace(/\s/g, '')) ) return true
        }
        return false
      })

      this.sortContacts(contacts);
    },

    sortContacts(contacts) {
      this.listContacts = {}
      this.contactsCount = 0
      if( !this.google.linked || this.google.linked === undefined ) return
      contacts.forEach((contact) => {
        this.contactsCount++
        const firstLetter = contact.phoneName[0].toUpperCase()
        if( this.listContacts[firstLetter] ) {
          this.listContacts[firstLetter].push(contact)
        } else {
          this.listContacts[firstLetter] = []
          this.listContacts[firstLetter].push(contact)
        }
      })
    },

    async googleRefresh() {
      try {
        this.loading = true
        await this.refreshGoogleContacts()
        this.loading = false
      } catch(error) {
        console.log(error)
      }
    },

    async googleSync() {
      try {
        this.loading = true
        await this.syncGoogleContacts()
        this.loading = false
        this.$confirm(
        {
          title: 'Thông báo',
          message: 'Danh bạ Google của bạn sẽ mất một khoảng thời gian để được làm mới, vui lòng đợi!',
          button: {
            yes: 'OK',
          }
        })
        setTimeout(() => {
          // console.log('lam moi google nay')
          this.refreshGoogleContacts()
        }, 15000)
      } catch(error) {
        console.log(error)
      }
    },

    async unlink() {
      this.$confirm({
        title: `Hủy liên kết với Google`,
        message: `Bạn muốn thực hiện điều này?`,
        button: {
          no: 'Không',
          yes: 'Thực hiện'
        },
        callback: async confirm => {
          if (confirm) {
            this.loading = true
            await this.googleUnlink()
            this.loading = false
          }
        }
      })
    },

    async accountLinking() {
      console.log('Dang lien ket tai khoan Google')
      let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=301608552892-g7inqpodo0dkvlvkmnaqrmpgf8oi695d.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/userinfo.email&redirect_uri=http://localhost:8080/google/get-auth-code&response_type=code&access_type=offline&prompt=select_account`
      window.location.href = url
    }
  },

  created() {
    this.sortContacts(this.google.contacts)
  },

  watch: {
    google(newValue) {
      this.sortContacts(newValue.contacts)
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-page__google {
  width: 675px;
  margin: 0 auto;

  .contacts-count {
    margin-top: 1rem;
    margin-left: 1rem;
  }

  .loading-page {
    text-align: center;
    margin-top: 5rem;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .unlink {
    margin-top: 2rem;
    margin-left: 1rem;

    &-btn {
      border: 1px solid #ddd;
      border-radius: 6px;
      display: inline-block;
      padding: 4px 1rem;
      margin: 4px 0 10px;
      text-align: center;
      font-size: 14px;
      background-color: #ebebeb;
      font-weight: 600;
      color: #ed5f0b;
      box-shadow: 0 2px 4px #00000047;
      cursor: pointer;

      i {
        color: #616161;
        margin-right: 6px;
      }

      &:hover {
        background-color: #ed5f0b;
        color: #fff;

        i {
          color: #000;
        }
      }
    }
  }

  .account-link {
    margin-top: 3rem;
    text-align: center;

    &-btn {
      margin-top: 2.5rem;
      display: inline-block;
      padding: 8px 1.5rem;
      background-color: #f0f0f0;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #ddd;

        i {
          color: #000;
        }
      }

      img.tism-logo {
        width: 40px;
        height: 40px;
      }

      img.google-logo {
        width: 40px;
        height: 40px;
      }

      i {
        margin: 0 .5rem 0 .7rem;
      }
    }
  }
}
</style>