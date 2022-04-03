<template>
  <section class="workspace-view">
    <app-header class="workspace-header" />
    <div class="workspace-wrapper">
      <nav class="workspace-nav">
        <div class="nav-options-top">
          <router-link to="/workspace" class="active">
            <span class="board-icon icon"></span>
            <span class="view-name">Boards</span>
          </router-link>
          <router-link to="/">
            <span class="home-icon icon"></span>
            <span class="view-name">Home</span>
          </router-link>
        </div>
      </nav>
      <div class="board-list-container">
        <board-list :boards="starredBoards" :showCreate="false" class="starred">
          <template v-slot:boards-name>Starred</template>
        </board-list>
        <board-list :boards="noneStarredBoards" :showCreate="false" class="recentlyViewed">
          <template v-slot:boards-name>Recently viewed</template>
        </board-list>
        <board-list :boards="boards" :showCreate="true" class="yourWorkspace">
          <template v-slot:boards-name>YOUR WORKSPACE</template>
        </board-list>
      </div>
    </div>
  </section>
</template>

<script>
import boardList from '../components/workspace/board-list.vue'
import AppHeader from '../components/app-header.vue'

export default {
  name: 'workspace-view',
  components: {
    boardList,
    AppHeader,
  },
  data() {
    return {}
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
    starredBoards() {
      var boards = this.$store.getters.boards
      return boards.filter((b) => b.isStarred)
    },
    noneStarredBoards() {
      var boards = this.$store.getters.boards
      return boards.filter((b) => !b.isStarred)
    },
  },
}
</script>
