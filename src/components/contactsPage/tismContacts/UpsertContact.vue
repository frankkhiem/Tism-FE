<template>
  <div class="upsert-contact__modal">
    <div 
      class="modal-close" 
      @click="$emit('close')"
      @mouseenter="hoverClose = true"
      @mouseleave="hoverClose = false"
    >
      <b-icon 
        v-if="hoverClose"
        icon="x" 
        class="border border-danger rounded" 
        variant="danger" 
        scale="1.2"
      ></b-icon>
      <b-icon 
        v-else
        icon="x" 
        class="border border-danger rounded" 
        variant="danger"
      ></b-icon>
    </div>
    <div class="modal-title">
      <div v-if="isUpdate">
        Chỉnh sửa liên hệ
      </div>
      <div v-else>
        Tạo liên hệ mới
      </div>
    </div>
    <div class="modal-main">
      <div class="contact-name">
        <label for="contact-name">
          Tên liên hệ
        </label>
        <span class="name-error">{{ errorContactName }}</span>
        <input 
          v-model="newContactName" 
          ref="nameInput" 
          id="contact-name" 
          type="text"
          @input="errorContactName = ''"
        >
      </div>
      <div class="contact-numbers">
        <label for="fisrt-contact-number">
          Số điện thoại
          <b-icon 
            icon="plus-square" 
            class="add-number" 
            variant="success"
            @click.prevent="addInputNumber"
          ></b-icon>
        </label>
        <div v-for="index in (countInputNumber)" :key="index" class="contact-number-item">
          <input 
            v-if="index === 1"
            v-model="contactNumbers[index - 1]"
            id="fisrt-contact-number" 
            class="input-contact-number" 
            type="text"
          >
          <input 
            v-else 
            v-model="contactNumbers[index - 1]"
            class="input-contact-number" type="text"
          >
          <i 
            v-if="countInputNumber > 1" 
            class="fa-solid fa-xmark remove-number-btn"
            @click="removeInputNumber(index - 1)"
          ></i>
        </div>
      </div>
    </div>
    <div class="modal-btns">
      <div class="cancel-btn"  @click="$emit('close')">
        Hủy
      </div>
      <div v-if="isUpdate" class="agree-btn" @click="updateContact">
        Sửa
      </div>
      <div v-else class="agree-btn" @click="createContact">
        Tạo
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    isUpdate: Boolean,
    currentContact: Object
  },

  computed: {

  },

  data() {
    return {
      hoverClose: false,
      newContactName: '',
      oldContactName: '',
      contactNumbers: [''],
      countInputNumber: 1,
      errorContactName: ''
    }
  },

  methods: {
    ...mapActions({
      createTismContact: 'createContact',
      updateTismContact: 'updateContact'
    }),

    addInputNumber() {
      this.countInputNumber++
      this.contactNumbers.push('')
    },

    removeInputNumber(index) {
      this.contactNumbers.splice(index, 1)
    },

    validateContact() {
      const phoneNumbers = this.contactNumbers.filter((number) => {
        return number
      })
      return {
        newPhoneName: this.newContactName.trim(),
        oldPhoneName: this.oldContactName,
        phoneNumbers
      }
    },

    async createContact() {
      try {
        const contact = this.validateContact()
        if( !contact.newPhoneName ) {
          this.errorContactName = 'Tên liên hệ cần được điền!'
          this.$refs.nameInput.focus()
          return
        }
        const response = await this.createTismContact({
          phoneName: contact.newPhoneName,
          phoneNumbers: contact.phoneNumbers
        })
        if( response.success ) {
          this.$emit('close')
        } else {
          this.errorContactName = 'Tên liên hệ đã tồn tại!'
          this.$refs.nameInput.focus()
          return
        }
      } catch(error) {
        console.log(error);
      }
    },

     async updateContact() {
      try {
        const contact = this.validateContact()
        if( !contact.newPhoneName ) {
          this.errorContactName = 'Tên liên hệ cần được điền!'
          this.$refs.nameInput.focus()
          return
        }
        const response = await this.updateTismContact(contact)
        if( response.success ) {
          this.$emit('close')
        } else {
          this.errorContactName = 'Tên mới đã tồn tại ở liên hệ khác!'
          this.$refs.nameInput.focus()
          return
        }
      } catch(error) {
        console.log(error);
      }
    }
  },

  created() {
    if( this.isUpdate && this.currentContact ) {
      this.newContactName = this.currentContact.phoneName
      this.oldContactName = this.currentContact.phoneName
      this.contactNumbers = this.currentContact.phoneNumbers.slice();
      this.countInputNumber = this.contactNumbers.length
    }
  },

  watch: {
    contactNumbers(newValue) {
      this.countInputNumber = newValue.length
    }
  }
}
</script>

<style lang="scss" scoped>
.upsert-contact__modal {
  position: relative;
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;

  .modal-close {
    position: absolute;
    top: 0;
    right: .5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    padding: 10px 1.5rem;
    border-bottom: 1px solid #ddd;
  }

  .modal-main {
    margin-top: 1rem;
    padding: 0 1.5rem;

    label {
      display: inline-block;
      cursor: pointer;
      width: fit-content;
    }

    input {
      display: block;
      width: 100%;
      padding: 5px 12px;
      border: 1px solid #aaa;
      border-radius: 5px;
      outline: none;

      &:focus {
        box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
      }
    }

    .contact-name {
      .name-error {
        color: red;
        font-size: 14px;
        float: right;
        margin-top: 5px;
        margin-right: .5rem;
      }
    }

    .contact-numbers {
      margin-top: 1.5rem;

      label .add-number {
        font-size: 1.2rem;
        margin-left: .5rem;
      }

      input.input-contact-number {
        margin-top: .5rem;
      }

      .contact-number-item {
        position: relative;

        .remove-number-btn {
          position: absolute;
          font-size: 14px;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          padding: 8px 12px;
          cursor: pointer;
          color: #ccc;

          &:hover {
            font-size: 16px;
            color: #888;
          }
        }
      }
    }
  }

  .modal-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    margin-bottom: 14px;
    padding: 0 1.5rem;

    div {
      padding: 4px 12px;
      border-radius: 5px;
      cursor: pointer;
    }

    .cancel-btn:hover {
      background-color: #85dadf2f;
    }

    .agree-btn {
      margin-left: .3rem;
      color: #fff;
      background-color: #4bcb50;

      &:hover {
        background-color: #46b04a;
      }
    }
  }
}
</style>