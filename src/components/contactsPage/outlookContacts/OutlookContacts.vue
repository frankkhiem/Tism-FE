<template>
  <div class="contacts-page__outlook">
    <ContactsTitle 
      :email="outlook.account"
      @outlook-refresh="outlookRefresh"
      @outlook-sync="outlookSync"
    ></ContactsTitle>
    <div v-if="loading" class="loading-page">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-if="!loading && !outlook.linked" class="account-link">
      <div class="account-link__intro">
        <h5>Bạn chưa liên kết <strong>Tism</strong> với tài khoản <strong>Outlook</strong> của mình</h5>
        <p>Nếu muốn đồng bộ danh bạ của bạn với Outlook, hãy kết nối ngay bây giờ!</p>
      </div>
      <div @click="accountLinking" class="account-link-btn">
        <img class="tism-logo" src="@/assets/img/IconPage.png" alt="Logo Tism">
        <i class="fa-solid fa-link"></i>
        <img class="outlook-logo" src="https://img.icons8.com/color/48/000000/ms-outlook.png" alt="Logo Outlook">
      </div>
    </div>
    <div v-if="!loading && outlook.linked">
      <ContactsSearch @search-contacts="search"></ContactsSearch>
      <div class="contacts-count">
        Có {{ contactsCount }} liên hệ
      </div>
      <ListHeader></ListHeader>
      <ListContacts :contacts="listContacts"></ListContacts>
      <div class="unlink">
        <div class="unlink-btn" @click="unlink">
          <i class="fa-solid fa-link-slash"></i>
          Hủy liên kết Outlook
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
      outlook: 'outlookContacts',
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
      refreshOutlookContacts: 'refreshOutlookContacts',
      outlookUnlink: 'outlookUnlink'
    }),

    search(keyword) {
      // console.log(keyword)
      const contacts = this.outlook.contacts.filter((contact) => {
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
      if( !this.outlook.linked || this.outlook.linked === undefined ) return
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

    async outlookRefresh() {
      this.loading = true
      await this.refreshOutlookContacts()
      this.loading = false
    },

    outlookSync() {
      console.log('dong bo nguoc outlook')
    },

    async unlink() {
      if( confirm('Bạn muốn hủy kết nối') ) {
        this.loading = true
        await this.outlookUnlink()
        this.loading = false
      } else {
        console.log('Không hủy')
      }
    },

    async accountLinking() {
      console.log('dang lien ket tai khoan outlook')
      let url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=e63fb652-b80d-439f-a487-87dc8ea3bd7b&response_type=code&redirect_uri=http://localhost:8080/outlook/get-auth-code&scope=User.Read User.ReadWrite Contacts.Read Contacts.ReadWrite offline_access&response_mode=query`
      window.location.href = url
    }
  },

  created() {
    this.sortContacts(this.outlook.contacts)
  },

  watch: {
    outlook(newValue) {
      this.sortContacts(newValue.contacts)
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-page__outlook {
  width: 50%;
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
        width: 30px;
        height: 30px;
      }

      img.outlook-logo {
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