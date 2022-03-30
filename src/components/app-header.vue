<template>
  <header class="app-header">
    <div class="left-header">
      <div @click="this.$router.push('/workspace')" class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>

      <button @click="this.$router.push('/workspace')">Workspace</button>
      <button @click="openModal('recent-modal', $event)">Recent <i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openModal('starred-modal', $event)">Starred <i class="fa-solid fa-chevron-down"></i></button>
      <!-- <button @click="openModal('templates-modal')">Templates <i class="fa-solid fa-chevron-down"></i></button> -->
      <button @click="openModal('create-board-modal')">Create</button>
    </div>
    <div class="right-header">
      <label>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search" />
      </label>
      <button class="notifications"><i class="fa-solid fa-bell"></i></button>
      <div @click="openModal('user-modal')" class="avatar-container" :title="member ? member.fullname : 'Guest'">
        <img v-if="member?.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ checkMember }}</span>
      </div>
    </div>
    <component v-if="cmpName" :is="cmpName" @closeModal="closeModal" @logout="logout" v-click-outside="() => closeModal()" :style="`top: ${posTop}px; left: ${posLeft}px`"> </component>
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
      } catch (err) {
        console.log(err)
      }
    },
    calcPosition(rect) {
      var { left} = rect
      this.posTop = 50
      this.posLeft = left
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
