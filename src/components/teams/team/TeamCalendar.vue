<template>
  <div id="team-calendar">
    <ejs-schedule
      :height="calendarHeight"
      width="100%"
      :selectedDate="selectedDate"
      :eventSettings="eventSettings"
    >
      <e-views>
        <e-view option="Week" startHour="08:00" endHour="18:00"></e-view>
        <e-view option="Month" showWeekend="false"></e-view>
      </e-views>
      <e-resources>
        <e-resource
          field="TypeId"
          title="Type"
          name="Types"
          :dataSource="typeDataSource"
          textField="TypeText"
          idField="Id"
          colorField="TypeColor"
        >
        </e-resource>
      </e-resources>
    </ejs-schedule>
  </div>
</template>
<script>
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  DragAndDrop,
  Resize,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-vue-schedule";
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      taskList: "taskList",
    }),
  },
  components: {
    "ejs-schedule": ScheduleComponent,
    "e-views": ViewsDirective,
    "e-view": ViewDirective,
    "e-resources": ResourcesDirective,
    "e-resource": ResourceDirective,
  },
  // Bound properties declaration
  data() {
    return {
      selectedDate: new Date(),
      allowMultiple: true,
      calendarHeight: 300,
      typeDataSource: [
        { TypeText: "To do", Id: 1, TypeColor: "#f1d45e" },
        { TypeText: "Doing", Id: 2, TypeColor: "#4da9e2" },
        { TypeText: "Done", Id: 3, TypeColor: "#63de69" },
      ],
      eventSettings: {
        dataSource: [],
      },
      data: []
    };
  },
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize],
  },
  methods: {
    prepareDataForCalendar() {
      this.data = [];
      this.taskList.forEach(task => {
        const taskType = task.type
        let taskData = {}
        taskData.Id = task._id
        taskData.Subject = task.name
        taskData.StartTime = (task.start_time.slice(0, 10)) + ' 08:00'
        taskData.EndTime = (task.end_time.slice(0, 10)) + ' 17:30'
        if (taskType == 1) {
          taskData.TypeId = 1
        }
        if (taskType == 2) {
           taskData.TypeId = 2
        }
        if (taskType == 3) {
           taskData.TypeId = 3
        }
        this.data.push(taskData)
      });
      this.eventSettings.dataSource = this.data
    }
  },
  created() {
    this.prepareDataForCalendar()
    this.calendarHeight = window.innerHeight - 58 - 168;
  },
};
</script>

<style lang="scss" scoped>

</style>
