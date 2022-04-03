<template>
  <section class="dashboard">
    <span @click="closeDashboard" class="close-modal-button" :class="coverButtonClass"></span>
    <div class="title">
      <h2>{{ board.title }}</h2>
      <span v-if="board.isStarred"><i class="fa-solid fa-star"></i></span>
    </div>
    <p>Created By: {{ board.createdBy.fullname }}</p>
    <div class="cards-container">
      <div class="dash-card members">
        <div class="left">
          <h2>{{ board.members.length }}</h2>
          <h4>Member<span v-if="board.members.length > 1">s</span></h4>
        </div>
        <div class="right board-members">
          <div class="avatar-container" v-for="member in board.members" :key="member._id" :title="member.fullname">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
            <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
          </div>
        </div>
      </div>
      <div class="dash-card">
        <div class="left">
          <h2>{{ cardsDetails }}</h2>
          <h4>Cards</h4>
        </div>
        <div>
          <h2>{{this.todosMap.todosCount}} Todos</h2>
          <span>{{this.todosMap.doneTodos}} of them marked as Done</span>
          <br>
          <h2>{{this.todosMap.checklistsCount}} Checklists</h2>
          <span>{{this.todosMap.doneChecklists}} of them marked as Done</span>
        </div>
      </div>
      <div class="dash-card"></div>
    </div>
    <div class="charts-container">
      <div class="chart">
        <doughnut-chart />
      </div>
      <div class="chart">
        <LineChart></LineChart>
      </div>
      <div class="chart">
        <BarChart></BarChart>
      </div>
    </div>
  </section>
</template>

<script>
import DoughnutChart from './doughnut-chart.vue'
import LineChart from './line-chart.vue'
import BarChart from './bar-chart.vue'
export default {
  name: '',
  data() {
    return {
        boardId: null,
        todosMap: {}
    }
  },
  created() {
    this.boardId = this.$route.params.boardId
    this.countTodos()
  },
  methods: {
    closeDashboard() {
      this.$router.push(`/board/${this.boardId}`)
    },
    countTodos() {
      var todosMap = {
        todosCount: 0,
        doneTodos: 0,
        checklistsCount: 0,
        doneChecklists: 0
      }
      this.board.groups.forEach(group => {
        group.cards.forEach(card => {
          card.checklists.forEach(checklist => {
            const doneTodos = checklist.todos.reduce((acc, todo) => {
              if (todo.isDone) {
                todosMap.doneTodos++
                acc++
              }
              todosMap.todosCount++
              return acc
            }, 0)
            todosMap.doneChecklists += (doneTodos === checklist.todos.length) ? 1 : 0
            todosMap.checklistsCount++
          })
        })
      })
      this.todosMap = todosMap
    }
  },
  computed: {
    board() {
      return this.$store.getters.currBoard
    },
    cardsDetails() {
      var cardsCount = 0
      this.board.groups.forEach((group) => {
        cardsCount += group.cards.length
      })
      return cardsCount
    },
    // doneTodos() {
    //   return `${this.todosMap.doneTodos} of total ${this.todosMap.todosCount} todos marked as done`
    // },
    // doneChecklists() {
    //   return `${this.todosMap.doneChecklists} of total ${this.todosMap.checklistsCount} marked as done`
    // }
    
  },
  components: {
    DoughnutChart,
    LineChart,
    BarChart
  },
}
</script>

<style></style>
