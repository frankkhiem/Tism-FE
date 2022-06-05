<template>
  <div class="team-page">
    <TeamPageHeaderVue
      @team-tasks="type = 'team-tasks'"
      @team-chat="type = 'team-chat'"
      @calendar="type = 'calendar'"
      :type="type"
      :team="team"
    >
    </TeamPageHeaderVue>
    <!-- Lists container -->
    <section v-if="type == 'team-tasks'" class="lists-container">
      <div class="list">
        <h3 class="list-title">Việc cần làm</h3>

        <ul
          class="list-items to-do"
          @drop="onDropToDo($event, tasks)"
          @dragover.prevent
          @dragenter.prevent
        >
          <li
            v-for="(task, index) in toDoTasks"
            :task="task"
            :key="index"
            @click="selectTask(task)"
            draggable
            @dragstart="startDrag($event, task)"
          >
            {{ task.name }}
          </li>
        </ul>

        <button class="add-card-btn btn" @click="createNewTask">
          Thêm công việc
        </button>
      </div>

      <div class="list">
        <h3 class="list-title">Việc đang làm</h3>

        <ul
          class="list-items pending"
          @drop="onDropPending($event, tasks)"
          @dragover.prevent
          @dragenter.prevent
        >
          <li
            v-for="(task, index) in pendingTasks"
            :task="task"
            :key="index"
            @click="selectTask(task)"
            draggable
            @dragstart="startDrag($event, task)"
          >
            {{ task.name }}
          </li>
        </ul>
      </div>

      <div class="list">
        <h3 class="list-title">Việc đã hoàn thành</h3>

        <ul
          class="list-items finished"
          @drop="onDropFinished($event, tasks)"
          @dragover.prevent
          @dragenter.prevent
        >
          <li
            v-for="(task, index) in finishedTasks"
            :task="task"
            :key="index"
            @click="selectTask(task)"
            draggable
            @dragstart="startDrag($event, task)"
          >
            {{ task.name }}
          </li>
        </ul>
      </div>
    </section>
    <section v-if="type == 'team-chat'" class="lists-container">
      <TeamChat></TeamChat>
    </section>
    <section
      v-if="type == 'calendar'"
      class="lists-container calendar-container"
    >
      <TeamCalendar></TeamCalendar>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TeamPageHeaderVue from "../components/teams/team/TeamPageHeader";
import AddTask from "../components/tasks/AddTask.vue";
import TeamChat from "../components/teams/team/teamChat/TeamChat";
import TeamCalendar from "../components/teams/team/TeamCalendar";

import socket from "@/helpers/socketClient";

export default {
  computed: {
    ...mapGetters({
      user: 'profile',
      team: 'team',
      tasks: "taskList"
    })
  },

  data() {
    return {
      type: "team-tasks",
      toDoTasks: [],
      pendingTasks: [],
      finishedTasks: [],
      taskRcv: Object,
    };
  },

  components: {
    TeamPageHeaderVue,
    TeamCalendar,
    TeamChat,
  },

  methods: {
    ...mapActions({
      getTeam: "getTeam",
      getMembersInfo: "getMembersInfo",
      playTeamMessageSound: "playTeamMessageSound",
      getTaskList: "getTaskList",
      updateTismTaskType: "updateTismTaskType",
    }),

    async refreshTeamPage() {
      try {
        await this.getTeam(this.$route.params.teamId);
        if ("success" in this.team) {
          this.$router.push({ name: "Not Found" });
        }
        this.getMembersInfo(this.$route.params.teamId)
        this.getTaskList(this.$route.params.teamId)
      } catch (error) {
        console.log(error);
      }
    },

    createNewTask() {
      this.taskRcv = new Object();
      this.$modal.show(
        AddTask,
        {
          isUpdate: false,
          taskRcv: this.taskRcv,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 800,
          height: "auto",
        },
        {
          "before-close": this.getTaskByTypes,
        }
      );
    },

    selectTask(task) {
      this.taskRcv = task;
      this.$modal.show(
        AddTask,
        {
          isUpdate: true,
          taskRcv: this.taskRcv,
        },
        {
          draggable: true,
          // resizable: true,
          adaptive: true,
          width: 800,
          height: "auto",
        },
        {
          "before-close": this.getTaskByTypes,
        }
      );
    },

    getTaskByTypes() {
      this.toDoTasks = this.tasks.filter((x) => x.type == 1);
      this.pendingTasks = this.tasks.filter((x) => x.type == 2);
      this.finishedTasks = this.tasks.filter((x) => x.type == 3);
    },

    startDrag(evt, task) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("taskId", task._id);
    },

    async onDropToDo(evt) {
      let taskId = evt.dataTransfer.getData("taskId");
      await this.updateTismTaskType({teamId: this.$route.params.teamId, taskId: taskId, taskType: 1});
      this.getTaskByTypes();
    },

    async onDropPending(evt) {
      let taskId = evt.dataTransfer.getData("taskId");
      await this.updateTismTaskType({teamId: this.$route.params.teamId, taskId: taskId, taskType: 2});
      this.getTaskByTypes();
    },

    async onDropFinished(evt) {
      let taskId = evt.dataTransfer.getData("taskId");
      await this.updateTismTaskType({teamId: this.$route.params.teamId, taskId: taskId, taskType: 3});
      this.getTaskByTypes();
    },
  },

  async created() {
    this.refreshTeamPage();
    socket.on("new-team-message", (newMessage) => {
      if (newMessage.team === this.$route.params.teamId) {
        this.playTeamMessageSound();
      }
    })
    socket.on('new-team-meeting', (newMessage) => {
      if( newMessage.team === this.$route.params.teamId && newMessage.from !== this.user.userId ) {
        this.playTeamMessageSound()
      }
    })

    await this.getTaskList(this.$route.params.teamId);
    this.getTaskByTypes();
  },

  destroyed() {
    socket.off('new-team-message')
    socket.off('deleted-team-message')
    socket.off('new-team-meeting')
    socket.off('end-team-meeting')
  }
}
</script>

<style lang="scss" scoped>
.team-page {
  // background-image: url('./../assets/img/bg1.jpeg');
  //  background-repeat: no-repeat;
  //  background-size: cover;
  background-color: #e9edd5;
}
:root {
  font-size: 10px;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  background-color: #0079bf;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font: inherit;
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
}
:focus {
  outline-color: #fa0;
}
/* Masthead */
.masthead {
  flex-basis: 4rem;
  display: flex;
  align-items: center;
  padding: 0 0.8rem;
  background-color: #0067a3;
  box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
}
.masthead .btn {
  background-color: #4c94be;
  border-radius: 0.3rem;
  transition: background-color 150ms;
}
.masthead .btn:hover {
  background-color: #3385b5;
}
.boards-menu {
  display: flex;
  flex-shrink: 0;
}
.boards-btn {
  flex-basis: 9rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-right: 0.8rem;
  padding: 0.6rem 0.8rem;
}
.boards-btn-icon {
  font-size: 1.7rem;
  padding-right: 1.2rem;
}
.board-search {
  flex-basis: 18rem;
  position: relative;
}
.board-search-input {
  height: 3rem;
  border: none;
  border-radius: 0.3rem;
  background-color: #4c94be;
  width: 100%;
  padding: 0 3rem 0 1rem;
  color: #fff;
}
.board-search-input:hover {
  background-color: #66a4c8;
}
.search-icon {
  font-size: 1.5rem;
  position: absolute;
  top: 50%;
  right: 0.8rem;
  transform: translateY(-50%) rotate(90deg);
  color: #fff;
}
.logo {
  flex: 1;
  font-family: "Courgette", cursive;
  font-size: 2.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 2rem;
  transition: color 150ms;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
}
.logo:hover {
  color: rgba(255, 255, 255, 0.8);
}
.logo-icon {
  padding-right: 0.4rem;
}
.user-settings {
  display: flex;
  height: 3rem;
  color: #fff;
}
.user-settings-btn {
  font-size: 1.5rem;
  width: 3rem;
  margin-right: 0.8rem;
}
.user-settings-btn:last-of-type {
  margin-right: 0;
}
/* Board info bar */
.board-info-bar {
  flex-basis: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.8rem 0;
  padding: 0 1rem;
  color: #f6f6f6;
}
.board-controls {
  display: flex;
}
.board-controls .btn {
  margin-right: 1rem;
}
.board-controls .btn:last-of-type {
  margin-right: 0;
}
.board-info-bar .btn {
  font-size: 1.4rem;
  font-weight: 400;
  transition: background-color 150ms;
  padding: 0 0.6rem;
  border-radius: 0.3rem;
  height: 3rem;
}
.board-info-bar .btn:hover {
  background-color: #006aa8;
}
.private-btn-icon,
.menu-btn-icon {
  padding-right: 0.6rem;
  white-space: nowrap;
}
.board-title h2 {
  font-size: 1.8rem;
  font-weight: 700;
  white-space: nowrap;
}
/* Lists */

// .lists-container::-webkit-scrollbar {
//   height: 2.4rem;
// }

// .lists-container::-webkit-scrollbar-thumb {
//   background-color: #66a3c7;
//   border: 0.8rem solid #0079bf;
//   border-top-width: 0;
// }
.lists-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 16px 0;
  height: 100%;
  // overflow-x: auto;
  height: calc(100vh - 58px - 80px - 70px);
}
.list {
  flex: 0 0 27rem;
  display: flex;
  flex-direction: column;
  background-color: #f9f6f6;
  height: 495px;
  border-radius: 0.3rem;
  margin-right: 1rem;
  width: 280px;
}
.list:last-of-type {
  margin-right: 0;
}
.list-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #484848;
  padding: 1rem;
  background-color: #f3d921e6;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}
.list-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 0 0.6rem 0.5rem;
  overflow-y: auto;
}

.to-do.list-items li {
  background-color: #f1d45e;
  color: #fffffff2;
}

.pending.list-items li {
  background-color: #4da9e2;
  color: #fffffff2;
}

.finished.list-items li {
  background-color: #63de69;
  color: #fffffff2;
}

// .list-items::-webkit-scrollbar {
//   width: 1.6rem;
// }

// .list-items::-webkit-scrollbar-thumb {
//   background-color: #c4c9cc;
//   border-right: 0.6rem solid #e2e4e6;
// }
.list-items li {
  // font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  background-color: #fff;
  padding: 0.65rem 0.6rem;
  color: #4d4d4d;
  border-bottom: 0.1rem solid #ccc;
  border-radius: 0.3rem;
  margin-bottom: 0.6rem;
  word-wrap: break-word;
  cursor: pointer;
}
.list-items li:last-of-type {
  margin-bottom: 0;
}
.list-items li:hover {
  background-color: #eee;
}
.add-card-btn {
  display: block;
  font-size: 1.4rem;
  font-weight: 400;
  color: #838c91;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
}
.add-card-btn:hover {
  background-color: #cdd2d4;
  color: #4d4d4d;
  text-decoration: underline;
}
.add-list-btn {
  flex: 0 0 27rem;
  display: block;
  font-size: 1.4rem;
  font-weight: 400;
  background-color: #006aa7;
  color: #a5cae0;
  padding: 1rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 150ms;
  text-align: left;
}
.add-list-btn:hover {
  background-color: #005485;
}
.add-card-btn::after,
.add-list-btn::after {
  content: "...";
}
/*
The following rule will only run if your browser supports CSS grid.
Remove or comment-out the code block below to see how the browser will fall-back to flexbox styling. 
*/
@supports (display: grid) {
  body {
    display: grid;
    grid-template-rows: 4rem 3rem auto;
    grid-row-gap: 0.8rem;
  }
  .masthead {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 2rem;
  }
  .boards-menu {
    display: grid;
    grid-template-columns: 9rem 18rem;
    grid-column-gap: 0.8rem;
  }
  .user-settings {
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-column-gap: 0.8rem;
  }
  .board-controls {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 1rem;
  }
  .lists-container {
    display: grid;
    // grid-auto-columns: 27rem;
    grid-auto-flow: column;
    grid-column-gap: 1.5rem;
  }
  .list {
    display: grid;
    grid-template-rows: auto minmax(auto, 1fr) auto;
  }
  .list-items {
    display: grid;
    grid-row-gap: 0.6rem;
  }
  .logo,
  .list,
  .list-items li,
  .boards-btn,
  .board-info-bar,
  .board-controls .btn,
  .user-settings-btn {
    margin: 0;
  }

  // .calendar-container {
  //   overflow-y: hidden;
  // }
  #js-licensing {
    display: none;
  }
}
</style>
