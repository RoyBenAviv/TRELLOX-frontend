<template>
  <header class="app-header">
    <div class="left-header">
      <div @click="this.$router.push('/workspace')" class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>
      <button class="recent" @click="openModal('recent-modal', $event)"><i class="fa-solid fa-chevron-down"></i></button>
      <button class="starred" @click="openModal('starred-modal', $event)"><i class="fa-solid fa-chevron-down"></i></button>
      <!-- <button @click="openModal('templates-modal')">Templates <i class="fa-solid fa-chevron-down"></i></button> -->
      <button @click="openModal('create-board-modal', $event)"></button>
    </div>
    <div class="right-header">
      <label>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search" />
      </label>
      <button class="notifications"><i class="fa-solid fa-bell"></i></button>
      <div @click="openModal('user-modal', $event)" class="avatar-container" :title="member ? member.fullname : 'Guest'">
        <img v-if="member?.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ checkMember }}</span>
      </div>
    </div>
    <component
    v-if="cmpName"
    :is="cmpName"
    :posLeft="posLeft" 
    :posTop="posTop"
    @toggleStar="toggleStar"
    @closeModal="closeModal"
    @logout="logout"
    v-click-outside="() => closeModal()"
    :style="`top: ${posTop}px; left: ${posLeft}px`"
    > </component>
  </header>
</template>

<script>
import userModal from './board/user-modal.vue'
import recentModal from './board/recent-modal.vue'
import starredModal from './board/starred-modal.vue'
// import templatesModal from './board/templates-modal.vue'
import createBoardModal from './board/create-board-modal.vue'

export default {
  name: '',
  data() {
    return {
      openCreate: false,
      openUser: false,
      cmpName: null,
      posLeft: null,
      posTop: null,
    }
  },
  components: {
    userModal,
    recentModal,
    createBoardModal,
    starredModal,
    // templatesModal,
  },
  methods: {
    openModal(cmpName, ev) {
      this.calcPosition(ev.target.getBoundingClientRect())
      this.cmpName = cmpName
    },
    closeModal() {
      this.cmpName = null
    },
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    },
    calcPosition(rect) {
      var { left } = rect
      const winWidth = window.innerWidth
      if (winWidth - left < 310) {
        left = winWidth - 310
      }
      this.posTop = 50
      this.posLeft = left
    },
    async toggleStar(board) {
      // const board = JSON.parse(JSON.stringify(this.board))
      console.log('toggle star')
      board.isStarred = !board.isStarred
      await this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  computed: {
    member() {
      return this.$store.getters.loggedinUser
    },
    checkMember() {
      return this.member ? this.member.fullname.split(' ')[0].split('')[0] + this.member.fullname.split(' ')[1].split('')[0] : 'G'
    },
  },
}
</script>
