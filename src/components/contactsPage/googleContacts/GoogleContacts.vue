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
    <div v-else>
      <ContactsSearch @search-contacts="search"></ContactsSearch>
      <div class="contacts-count">
        Có {{ contactsCount }} liên hệ
      </div>
      <ListHeader></ListHeader>
      <ListContacts :contacts="listContacts"></ListContacts>
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
      this.loading = true
      await this.refreshGoogleContacts()
      this.loading = false
    },

    googleSync() {
      console.log('dong bo nguoc google')
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
}
</style>