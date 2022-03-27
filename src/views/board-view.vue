<template>
  <section class="board-wrapper" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }" v-if="board">
    <app-header class="board-header" />
    <div class="board-view">
      <nav class="board-nav">
        <div class="left-nav">
          <h2 @input="editBoardTitle" :contenteditable="true">{{ board.title }}</h2>
          <button class="star"></button> <span class="seperator">|</span>
          <div class="members-container">
            <div class="avatar-container" v-for="member in members" :key="member.id" :title="member.fullname">
              <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
              <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
            </div>

          </div>
            <button class="invite"><i class="fa-solid fa-user-plus"></i> Invite</button>
        </div>
        <div class="right-nav">
          <button><i class="fa-solid fa-filter"></i> Filter</button>
          <button @click="openMenu = !openMenu"><i class="fa-solid fa-ellipsis"></i> Show menu</button>
        </div>
      </nav>
      <Transition name="menu">
        <board-menu @closeMenu="openMenu = false" @setBoardBg="setBoardBg" v-if="openMenu" />
      </Transition>
      <!-- <div > -->
      <Container drag-class="on-dragging" orientation="horizontal" class="group-container" @drop="onGroupDrop($event)">
        <Draggable v-for="group in board.groups" :key="group.id">
          <group-preview :group="group" @onCardDrop="onCardDrop" />
        </Draggable>
        <div class="open-group-container" @click="isAddGroup = true" v-if="!isAddGroup"><i class="fa-solid fa-plus"></i><span>Add another list</span></div>
        <div class="add-group-container" v-else>
          <input @keyup.enter="addGroup" v-model="groupTitle" v-focus type="text" placeholder="Enter list title..." />
          <div class="add-group-actions">
            <button @click="addGroup">Add list</button><span @click="isAddGroup = false"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
      </Container>
      <!-- </div> -->
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import groupPreview from '../components/board/group-preview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../services/drag.helpers'
import appHeader from '../components/app-header.vue'
import boardMenu from '../components/board/board-menu.vue'

export default {
  components: {
    groupPreview,
    Container,
    Draggable,
    appHeader,
    boardMenu,
  },
  data() {
    return {
      isAddGroup: false,
      groupTitle: '',
      board: null,
      openMenu: false,
      savingGroup: false,
    }
  },
  async created() {
    const { boardId } = this.$route.params
    this.board = await this.$store.dispatch({ type: 'setCurrBoard', boardId })
  },
  methods: {
    async addGroup() {
      await this.$store.dispatch({ type: 'addGroup', title: this.groupTitle })
      this.groupTitle = ''
    },
    async onGroupDrop(dropResult) {
      const board = Object.assign({}, this.board)
      board.groups = applyDrag(board.groups, dropResult)
      await this.$store.dispatch({ type: 'saveBoard', board })
      this.board = board
    },
    onCardDrop({ cards, groupId }) {
      const board = JSON.parse(JSON.stringify(this.board))
      const idx = this.board.groups.findIndex((group) => group.id === groupId)
      board.groups[idx].cards = cards
      this.board = board
      this.$store.dispatch({ type: 'saveBoard', board })
    },
    async setBoardBg(boardBg) {
      // this.board.style.bgImgUrl = boardBg
      const board = JSON.parse(JSON.stringify(this.board))
      board.style.bgImgUrl = boardBg
      await this.$store.dispatch({ type: 'saveBoard', board })
    },
    editBoardTitle(ev) {
      const board = JSON.parse(JSON.stringify(this.board))
      board.title = ev.currentTarget.textContent
      this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  computed: {
    boardFromStore() {
      return this.$store.getters.currBoard
    },
    members() {
      return this.$store.getters.currBoard.members
    },
  },
  watch: {
    boardFromStore: {
      handler() {
        console.log('boardFromStore is reloading')
        this.board = this.boardFromStore
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.smooth-dnd-container.horizontal {
  display: flex;
}
.on-dragging {
  transform: rotate(10deg);
}
.menu-enter-active {
  transition: transform 0.3s ease-out;
}
.menu-leave-active {
  transition: transform 0.5s;
}
.menu-enter-from,
.menu-leave-to {
  transform: translateX(450px);
}
</style>
