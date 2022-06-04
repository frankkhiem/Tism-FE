<template>
  <div id="add-new-task-modal">
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
      <div>Thêm mới Công việc</div>
    </div>
    <div class="modal-main">
      <div class="create-task-container">
        <div class="content left-content">
          <div class="input-wrapper">
            <div class="input-title">Tên công việc</div>
            <input type="text" id="taskName_ipt" />
          </div>
          <div class="input-wrapper" v-if="isAssigned">
            <div class="input-title">Thông tin chỉ định</div>
            <div class="assign-wrapper">
              <div class="user-ava" v-tooltip="'You have new messages.'">{{ userFormatedName }}</div>
              <date-range-picker
                ref="picker"
                :opens="'right'"
                :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy HH:mm:ss' }"
                :showDropdowns="true"
                :singleDatePicker="'range'"
                :autoApply="true"
                :apendToBody="true"
                v-model="dateRange"
              >
                <template v-slot:input="picker" style="min-width: 350px">
                  {{ picker.startDate | formatDate }} -
                  {{ picker.endDate | formatDate }}
                </template>
              </date-range-picker>
            </div>
          </div>
          <div class="input-wrapper">
            <div class="input-title">Miêu tả</div>
            <textarea name="" id="taskDes_ipt" cols="30" rows="8"></textarea>
          </div>
        </div>

        <div class="content right-content">
          <div>Thêm vào thẻ</div>
          <div class="add-tag" @click="openPersonelAssign">
            <i class="fa-solid fa-user-plus" style="margin-right: 6px"></i>Chỉ
            định
          </div>
          <div class="add-tag white-ver" @click="openCalendar">
            <i class="fa-solid fa-calendar-days" style="margin-right: 12px"></i
            >Đặt lịch
          </div>
        </div>
      </div>
    </div>
    <div class="modal-btns">
      <div class="cancel-btn" @click="$emit('close')">Hủy</div>
      <div class="agree-btn">Tạo</div>
    </div>
  </div>
</template>

<script>
import AddPersonel from '../../components/tasks/AddPersonel.vue'

import DateRangePicker from "vue2-daterange-picker";
//you need to import the CSS manually
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker },
  props: {
    isUpdate: Boolean,
  },
  data() {
    return {
      hoverClose: false,
      isAssigned: true,
      dateRange: {
        startDate: null,
        endDate: null,
      },
      isShowCalendar: false,
      userFormatedName: "?",
			executorName: "",
    };
  },
  methods: {
    openCalendar() {
      this.isShowCalendar = !this.isShowCalendar;
      setTimeout(() => {
        this.$refs.picker.togglePicker("boolean", this.isShowCalendar);
      }, 200);
    },

    openPersonelAssign() {
      this.$modal.show(
        AddPersonel,
        {
          isUpdate: false,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 350,
          height: "auto",
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
#add-new-task-modal {
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

    .create-task-container {
      margin: 0;
      display: flex;
      justify-content: space-between;

      .left-content {
        width: 60%;

        .assign-wrapper {
          display: flex;
          justify-content: space-between;

          .user-ava {
            border-radius: 50%;
            background-color: rgb(75, 72, 72);
            color: #fff;
            width: 36px;
            height: 36px;
            text-align: center;
            line-height: 34px;
            font-size: 28px;
						cursor: pointer;
          }
        }
      }

      .right-content {
        width: 30%;
        padding: 10px;

        .add-tag {
          background-color: #1b74e4;
          color: #fff;
          border-radius: 3px;
          width: 100%;
          margin: 12px 0;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0px 1px 3px 1px rgba(9, 30, 66, 0.25);
          cursor: pointer;
          transition: all 0.1s linear;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }

      .input-wrapper {
        margin: 10px;

        .vue-daterange-picker {
          width: 87%;
        }

        .input-title {
          margin-bottom: 10px;
        }

        .executor-wrapper {
          display: flex;
        }

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
