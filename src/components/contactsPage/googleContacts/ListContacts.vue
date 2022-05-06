<template>
  <div class="list-contacts">
    <div v-for="(groupContacts, groupName, index) in contacts" :key="index">
      <div class="group-contacts__name">
        {{ groupName }}
      </div>
      <div class="group-contacts__container">
        <ContactItem 
          v-for="(contact, index) in groupContacts" 
          :key="index"
          :contact="contact"
        >          
        </ContactItem>
      </div>
    </div>
  </div>
</template>

<script>
import ContactItem from './ContactItem'

export default {
  components: {
    ContactItem
  },

  props: {
    contacts: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-contacts {
  max-height: 600px;
  overflow-y: auto;
  padding: 0 .5rem;
  
  .group-contacts__name {
    margin: 10px 2rem;
    font-size: 20px;
    cursor: default;
  }

  .group-contacts__container {
    width: 100%;
    border-radius: 1rem;
    background-color: #f6f6f6;
    padding: 5px 1.5rem;
  }
}
</style>