<template>
  <section class="workspace-view">
    <app-header class="workspace-header" />
    <div class="workspace-wrapper">
      <nav class="workspace-nav">
        <div class="nav-options-top">
          <router-link to="/workspace" :class="{ active: currpage === 'board' }" @click="setCurrpage('board')">
            <span class="board-icon icon"></span>
            <span class="view-name">Boards</span>
          </router-link>
          <router-link to="/workspace" :class="{ active: currpage === 'template' }" @click="setCurrpage('template')">
            <span class="template-icon icon"></span>
            <span class="view-name">Templates</span>
          </router-link>
          <router-link to="/" :class="{ active: currpage === 'home' }" @click="setCurrpage('home')">
            <span class="home-icon icon"></span>
            <span class="view-name">Home</span>
          </router-link>
        </div>
      </nav>
      <div v-if="currpage === 'board'" class="board-list-container">
        <board-list :boards="starredBoards" :showCreate="false">
          <template v-slot:boards-name>Starred</template>
        </board-list>
        <board-list :boards="recentlyViewd" :showCreate="false">
          <template v-slot:boards-name>Recently viewed</template>
        </board-list>
        <board-list :boards="yourWorkspace" :showCreate="true">
          <template v-slot:boards-name>YOUR WORKSPACES</template>
        </board-list>
      </div>
      <div v-if="currpage === 'template'" class="board-list-container">
        <board-list :boards="templates" :showCreate="false">
          <template v-slot:boards-name>Templates</template>
        </board-list>
      </div>
    </div>
  </section>
</template>

<script>
import boardList from '../components/workspace/board-list.vue'
import AppHeader from '../components/app-header.vue'
import BoardList from '../components/workspace/board-list.vue'

export default {
  name: 'workspace-view',
  components: {
    boardList,
    AppHeader,
    BoardList,
  },
  data() {
    return {
      currpage: 'board',
      starredBoards: null,
      yourWorkspace: null,
    }
  },
  created() {
    this.loadBoards()
  },
  methods: {
    async loadBoards(){
      this.starredBoards = await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: true } })
    this.yourWorkspace = await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: false } })
    },
    setCurrpage(value) {
      this.currpage = value
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards
    },
    // async starredBoards(){
    //   return await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: true } })
    // },
    recentlyViewd(){
      return this.boards
    },
    // yourWorkspace(){
    //   return await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: false } })
    // },
    templates(){
      return this.boards
    },
  },
  watch: {
    filterBy: {
      handler() {
        this.created()
      },
      deep: true,
    },
  },
}
</script>
