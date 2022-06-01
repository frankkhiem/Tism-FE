<template>
  <div id="team-calendar">
    <ejs-schedule
      height="550px"
      width="100%"
      :selectedDate="selectedDate"
      :eventSettings="eventSettings"
    >
      <e-views>
        <e-view option="Day"></e-view>
        <e-view option="Week" startHour="07:00" endHour="15:00"></e-view>
        <e-view option="WorkWeek" startHour="10:00" endHour="18:00"></e-view>
        <e-view option="Month" showWeekend="false"></e-view>
        <e-view option="Agenda"></e-view>
      </e-views>
      <e-resources>
        <e-resource
          field="OwnerId"
          title="Owner"
          name="Owners"
          :dataSource="ownerDataSource"
          textField="OwnerText"
          idField="Id"
          colorField="OwnerColor"
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

export default {
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
      selectedDate: new Date(2021, 7, 12),
      allowMultiple: true,
      ownerDataSource: [
        { OwnerText: "Nancy", Id: 1, OwnerColor: "#ffaa00" },
        { OwnerText: "Steven", Id: 2, OwnerColor: "#f8a398" },
        { OwnerText: "Michael", Id: 3, OwnerColor: "#7499e1" },
      ],
      eventSettings: {
        dataSource: [
          {
            Id: 1,
            Subject: "Nhiệm vụ thứ nhất",
            EventType: "Confirmed",
            StartTime: new Date(2021, 7, 10, 9, 0),
            EndTime: new Date(2021, 7, 10, 10, 0),
            OwnerId: 2,
          },
          {
            Id: 2,
            Subject: "Nhiệm vụ thứ hai",
            EventType: "Confirmed",
            StartTime: new Date(2021, 7, 11, 10, 0),
            EndTime: new Date(2021, 7, 11, 11, 30),
            OwnerId: 3,
          },
          {
            Id: 3,
            Subject: "Nhiệm vụ thứ ba",
            EventType: "Requested",
            StartTime: new Date(2021, 7, 12, 11, 30),
            EndTime: new Date(2021, 7, 12, 12, 30),
            OwnerId: 1,
          },
        ],
      },
    };
  },
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize],
  },
};
</script>

<style></style>
