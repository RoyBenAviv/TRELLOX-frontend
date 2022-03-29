<template>
  <header class="app-header">
    <div class="left-header">
      <div @click="this.$router.push('/workspace')" class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>
      
      <button @click="openModal('workspaces-modal')">Workspaces <i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openModal('recent-modal')">Recent <i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openModal('starred-modal')">Starred <i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openModal('templates-modal')">Templates <i class="fa-solid fa-chevron-down"></i></button>
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
      <component class="app-header-modals" v-if="cmpName" :is="cmpName" @closeModal="closeModal" v-click-outside="() => closeModal()" @logout="logout"> </component>
  </header>
</template>

<script>
import userModal from './board/user-modal.vue'
import workspacesModal from './board/workspaces-modal.vue'
import recentModal from './board/recent-modal.vue'
import starredModal from './board/starred-modal.vue'
import templatesModal from './board/templates-modal.vue'
import createBoardModal from './board/create-board-modal.vue'

export default {
  name: '',
  data() {
    return {
      openCreate: false,
      openUser: false,
      cmpName: null,
    }
  },
  methods: {
    openModal(cmpName) {
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
    }
  },
  computed: {},
  components: {
    userModal,
    workspacesModal,
    recentModal,
    createBoardModal,
    starredModal,
    templatesModal
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

<style></style>
