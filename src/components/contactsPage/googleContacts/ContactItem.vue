<template>
  <div class="contact-item" @click="show = !show">
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
  </div>
</template>

<script>
export default {
  props: {
    contact: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      show: false
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  .contact {
    &__icon {
      width: 30px;
      height: 30px;
      background-image: url('~@/assets/img/person.png');
      background-size: cover;
      margin-right: 6px;
    }

    &__name {
      margin-left: 4rem;
      flex-basis: 48%;
    }

    &__numbers {
      display: flex;
      align-items: baseline;
    }

    &__number {
      margin-bottom: .6rem;

      span {
        display: inline-block;
        width: 160px;
      }

      a {
        color: #1e70bf;
        text-decoration: none;

        &:hover {
          color: #03157f;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>