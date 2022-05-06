<template>
  <div class="contacts-page__tism">
    <ContactsTitle 
      :checked-names="checkedNames"
      @create-contact="createContact"
      @tism-refresh="tismRefresh"
      @tism-sync="tismSync"
    >
    </ContactsTitle>
    <div v-if="loading" class="loading-page">
      <img src="@/assets/img/Dual Ring-1s-200px.gif" alt="">
    </div>
    <div v-else>
      <ContactsSearch @search-contacts="search"></ContactsSearch>
      <ContactsInfo 
        :contacts-count="contactsCount"
        :contacts-sync-at="tism.syncAt"
      >
      </ContactsInfo>
      <ListHeader 
        @check-all-change="checkAll"
        :checked-all="checkedAll"
        :contacts-count="contactsCount"
      ></ListHeader>
      <ListContacts
        :contacts="listContacts"
        :checked-names="checkedNames"
        @update-contact="updateContact"
      ></ListContacts>
      <div 
        v-if="contactsCount === 0" 
        class="empty-contacts"
        @click="createContact"
      >
        Danh bạ trống, hãy tạo mới!
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContactsTitle from './ContactsTitle'
import ContactsSearch from './ContactsSearch'
import ContactsInfo from './ContactsInfo'
import ListHeader from './ListHeader'
import ListContacts from './ListContacts'
import UpsertContact from './UpsertContact'

export default {
  components: {
    ContactsTitle,
    ContactsSearch,
    ContactsInfo,
    ListHeader,
    ListContacts
  },

  computed: {
    ...mapGetters({
      tism: 'tismContacts',
    })
  },

  data() {
    return {
      listContacts: {},
      contactsCount: 0,
      loading: false,
      checkedNames: [],
      checkedAll: false
    }
  },

  methods: {
    ...mapActions({
      refreshTismContacts: 'getSyncContacts',
      syncTismContacts: 'syncContacts'
    }),

    search(keyword) {
      // console.log(keyword)
      const contacts = this.tism.contacts.filter((contact) => {
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
      this.contactsCount = 0,
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

    async tismRefresh() {
      this.loading = true
      await this.refreshTismContacts()
      this.loading = false
    },

    async tismSync() {
      this.loading = true
      await this.syncTismContacts()
      this.loading = false
    },

    createContact() {
      this.$modal.show( 
        UpsertContact,
        {
          isUpdate: false
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 460,
          height: 'auto'
        }
      )
    },

    updateContact(contact) {
      this.$modal.show( 
        UpsertContact,
        {
          isUpdate: true,
          currentContact: contact
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 460,
          height: 'auto'
        }
      )
    },

    checkAll(checked) {
      this.checkedNames = []
      if( checked ) {
        for( let groupContacts in this.listContacts ) {
          for( let contact of this.listContacts[groupContacts] ) {
            this.checkedNames.push(contact.phoneName)
          }
        }
      }
    }
  },

  created() {
    if( this.tism.contacts ) {
      this.sortContacts(this.tism.contacts)
    }
  },

  watch: {
    tism(newValue) {
      this.sortContacts(newValue.contacts)
    },

    listContacts() {
      this.checkAll(false)
    },

    checkedNames(newValue) {
      if( newValue.length === this.contactsCount && this.contactsCount !== 0 ) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-page__tism {
  width: 810px;
  margin: 0 auto;

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

      img.tism-logo {
        width: 40px;
        height: 40px;
      }

      i {
        margin: 0 .5rem 0 .7rem;
      }
    }
  }

  .empty-contacts {
    margin-top: 4rem;
    font-size: 18px;
    text-align: center;
    color: #28afb7;
    cursor: pointer;

    &:hover {
      color: #1965a9;
    }
  }
}
</style>