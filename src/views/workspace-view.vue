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
          <!-- <router-link to="/workspace" :class="{ active: currpage === 'template' }" @click="setCurrpage('template')">
            <span class="template-icon icon"></span>
            <span class="view-name">Templates</span>
          </router-link> -->
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
        <board-list :boards="recentlyViewed" :showCreate="false" class="recentlyViewed">
          <template v-slot:boards-name>Recently viewed</template>
        </board-list>
        <board-list :boards="yourWorkspace" :showCreate="true" class="yourWorkspace">
          <template v-slot:boards-name>YOUR WORKSPACES</template>
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
    return {
      starredBoards: null,
      yourWorkspace: null,
      recentlyViewed: null,
    }
  },
  created() {
    this.loadBoards()
  },
  methods: {
    async loadBoards() {
      this.starredBoards = await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: true } })
      this.yourWorkspace = await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: false } })
      this.recentlyViewed = await this.$store.dispatch({ type: 'getBoards', filterBy: { recentlyViewed: 2 } })
    },
    setCurrpage(value) {
      this.currpage = value
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
  watch: {
    boards: {
      handler() {
        this.loadBoards()
      },
      deep: true,
    },
  },
}
</script>
