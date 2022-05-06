<template>
  <div class="contact-item" @click="show = !show">
    <div class="contact__checkbox">
      <input type="checkbox" v-model="checked" @click.stop>
    </div>
    <div class="contact__icon">
    </div>
    <div class="contact__name">
      {{ contact.phoneName }}
    </div>
    <div v-if="show" class="contact__numbers">
      <div>
        <div 
          class="contact__number"
          v-for="(phoneNumber, index) in contact.phoneNumbers" 
          :key="index"
        >
          <span>
            <a :href="`tel:${phoneNumber}`" @click.stop>
              {{ phoneNumber }}
            </a>
          </span>
        </div>
      </div>
      <i v-if="contact.phoneNumbers.length > 1" class="fa-solid fa-caret-up show-less"></i>
    </div>
    <div v-else class="contact__number">
      <span>
        <a :href="`tel:${contact.phoneNumbers[0]}`" @click.stop>
          {{ contact.phoneNumbers[0] }}
        </a>
      </span>
      <i v-if="contact.phoneNumbers.length > 1" class="fa-solid fa-caret-down show-more"></i>
    </div>
    <div class="contact__actions" :style="{ fontSize: '1.5rem' }">
      <div 
        class="edit-btn" 
        @mouseenter="hoverEdit = true" 
        @mouseleave="hoverEdit = false"
        @click.stop="updateContact"
      >
        <b-icon 
          v-if="hoverEdit"
          icon="pen-fill" 
          class="border border-warning rounded p-1" 
          variant="warning"
          scale="1.2"
        ></b-icon>
        <b-icon 
          v-else
          icon="pen-fill" 
          class="border border-warning rounded p-1" 
          variant="warning"
        ></b-icon>
      </div>
      <div 
        class="delete-btn" 
        @mouseenter="hoverDelete = true" 
        @mouseleave="hoverDelete = false"
        @click.stop="deleteAContact"
      >
        <b-icon 
          v-if="hoverDelete"
          icon="trash" 
          class="border border-danger rounded p-1" 
          variant="danger"
          scale="1.2"
        ></b-icon>
        <b-icon 
          v-else
          icon="trash" 
          class="border border-danger rounded p-1" 
          variant="danger"
        ></b-icon>
      </div>
    </div>  
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    contact: {
      type: Object,
      required: true
    },
    checkedNames: Array
  },

  computed: {
    checked: {
      get: function() {
        if( this.checkedNames.includes(this.contact.phoneName) ) return true 
        return false
      },

      set: function(value) {
        if( value ) {
          if( !this.checkedNames.includes(this.contact.phoneName) ) {
            this.checkedNames.push(this.contact.phoneName)
            this.checkedNames.sort()
          }
        } else {
          this.checkedNames.splice(this.checkedNames.indexOf(this.contact.phoneName), 1);
        }
      }
    }
  },

  data() {
    return {
      show: false,
      hoverEdit: false,
      hoverDelete: false
    }
  },

  methods: {
    ...mapActions({
      deleteContact: 'deleteContact'
    }),

    updateContact() {
      this.$emit('update-contact')
    },

    deleteAContact() {
      this.$confirm(
        {
          title: `Xóa '${this.contact.phoneName}'`,
          message: `Bạn có chắc muốn xóa liên hệ này?`,
          button: {
            no: 'Hủy',
            yes: 'Xóa'
          },
          callback: async confirm => {
            if (confirm) {
              await this.deleteContact(this.contact.phoneName)
            }
          }
        }
      )
    }
  },
}
</script>

<style lang="scss" scoped>
.contact-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
  cursor: default;

  &:last-child {
    border-bottom: none;
  }

  .contact {
    &__checkbox {
      margin-left: .5rem;

      input {
        cursor: pointer;
      }
    }

    &__icon {
      width: 30px;
      height: 30px;
      background-image: url('~@/assets/img/person.png');
      background-size: cover;
      margin-left: 2rem;
      margin-right: 6px;
    }

    &__name {
      margin-left: 4rem;
      flex-basis: 230px;
    }

    &__numbers {
      display: flex;
      align-items: baseline;
      position: relative;
      width: 150px;

      .show-less {
        position: absolute;
        top: 6px;
        right: 0;
        cursor: pointer;
      }
    }

    &__number {
      margin-bottom: .6rem;
      width: 150px;

      span {
        display: inline-block;
        width: 140px;
      }

      a {
        color: #1e70bf;
        text-decoration: none;

        &:hover {
          color: #03157f;
        }
      }

      &:last-child, &:nth-child(4) {
        margin-bottom: 0;
      }

      .show-more {
        cursor: pointer;
      }
    }

    &__actions {
      margin-left: 4rem;
      display: flex;

      > div {
        cursor: pointer;
      }

      .edit-btn {
        margin-right: 20px;
      }
    }
  }
}
</style>