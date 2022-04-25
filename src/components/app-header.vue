<template>
  <header class="app-header">
    <div class="left-header">
      <div @click="checkPath" class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>
      <button class="recent" @click="openModal('recent-modal', $event)"><i class="fa-solid fa-chevron-down"></i></button>
      <button class="starred" @click="openModal('starred-modal', $event)"><i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openModal('create-board-modal', $event)"></button>
    </div>
    <div class="right-header">
      <label>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" v-model="filterBy" @click="openModal('search-modal')" placeholder="Search" />
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
      :boards="boards"
      @toggleStar="toggleStar"
      @closeModal="closeModal"
      @logout="logout"
      v-click-outside="() => closeModal()"
      :style="`top: ${posTop}px; left: ${posLeft}px`"
    >
    </component>
  </header>
</template>

<script>
import userModal from './board/user-modal.vue'
import recentModal from './board/recent-modal.vue'
import starredModal from './board/starred-modal.vue'
import searchModal from './board/search-modal.vue'
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
      filterBy: null,
    }
  },
  components: {
    userModal,
    recentModal,
    createBoardModal,
    starredModal,
    searchModal,
  },
  methods: {
    openModal(cmpName, ev) {
      if (ev) this.calcPosition(ev.target.getBoundingClientRect())
      else {
        this.posTop = null
        this.posLeft = null
        console.log('else');
      }
      this.cmpName = cmpName
    },
    closeModal() {
      this.cmpName = null
      this.posTop = null
      this.posLeft = null
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
      board.isStarred = !board.isStarred
      await this.$store.dispatch({ type: 'saveBoard', board })
    },
    checkPath() {
      if (this.$route.path === '/workspace') this.$router.push('/')
      else if (this.$route.name === 'board') this.$router.push('/workspace')
    },
  },
  computed: {
    member() {
      return this.$store.getters.loggedinUser
    },
    checkMember() {
      return this.member ? this.member.fullname.split(' ')[0].split('')[0] + this.member.fullname.split(' ')[1].split('')[0] : 'G'
    },
    boards() {
      var boards = this.$store.getters.boards
      if (!this.filterBy) return boards
      const regex = new RegExp(this.filterBy, 'i')
      return boards.filter((board) => regex.test(board.title))
    },
  },
}
</script>
