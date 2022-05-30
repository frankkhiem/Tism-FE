<template>
  <div id="add-calendar-modal">
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
      <div>Đặt lịch</div>
    </div>
    <div class="modal-main">
      <div class="add-calendar-container">
        <date-range-picker
          ref="picker"
          :opens="'center'"
          :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy HH:mm:ss' }"
          :showDropdowns="true"
					:singleDatePicker="'range'"
          :autoApply="true"	
          v-model="dateRange"
          @finish-selection="logEvent('event: finishSelection', $event)"
        >
          <template v-slot:input="picker" style="min-width: 350px">
            {{ picker.startDate }} - {{ picker.endDate }}
          </template>
        </date-range-picker>
      </div>
    </div>
    <div class="modal-btns">
      <div class="cancel-btn" @click="$emit('close')">Hủy</div>
      <div class="agree-btn">Tạo</div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
//you need to import the CSS manually
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker },
  data() {
    return {
      hoverClose: false,
			dateRange: {
				startDate: null,
				endDate: null
			}
    };
  },
};
</script>

<style lang="scss" scoped>
#add-calendar-modal {
  position: relative;
  font-family: "Source Sans Pro", "Fira Sans", Arial, sans-serif;

  .modal-close {
    position: absolute;
    top: 0;
    right: 0.5rem;
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
    padding: 0 1rem;

    .add-calendar-container {
      margin: 0;
      display: flex;
      justify-content: space-between;

      textarea,
      input {
        font-size: 16px;
        line-height: 28px;
        padding: 8px 16px;
        width: 100%;
        min-height: 44px;
        border: unset;
        border-radius: 6px;
        outline-color: rgb(84, 105, 212);
        background-color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px;
        resize: none;
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
      margin-left: 0.3rem;
      color: #fff;
      background-color: #4bcb50;

      &:hover {
        background-color: #46b04a;
      }
    }

    .agree-btn[disabled="disabled"] {
      pointer-events: none;
      opacity: 0.4;
    }
  }
}
</style>
