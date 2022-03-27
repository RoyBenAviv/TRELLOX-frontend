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
      <div class="board-list-container">
        <!-- <div class="recently-viewed"> -->
        <!-- <h2>Recently viewed</h2> -->
        <board-list :boards="boards">
          <template v-slot:boards-name>Recently viewed</template>
        </board-list>
        <!-- </div> -->

        <!-- <div class="recently-viewed">
          <h2>Recently viewed</h2>
          <board-list :boards="boards" />
        </div> -->
        <!-- <div class="your-workspaces">
          <h2>your workspaces</h2>
          <board-list :boards="boards" />
          <div class="create-board"><p>Create new board</p></div>
        </div> -->
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
    }
  },
  methods: {
    setCurrpage(value) {
      this.currpage = value
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
}
</script>
