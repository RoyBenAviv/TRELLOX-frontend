<template>
  <section class="board-wrapper" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')' }" v-if="board">
    <app-header />
    <div class="board-view">
      <nav class="board-nav">
        <div class="left-nav">
          <h2>{{ board.title }}</h2>
          <button class="star"></button> |
          <div class="members-container">
            <div class="members">
              <div class="member-pic"></div>
              <div class="member-pic"></div>
              <div class="member-pic"></div>
            </div>

            <button class="invite"><i class="fa-solid fa-user-plus"></i> Invite</button>
          </div>
        </div>
        <div class="right-nav">
          <button><i class="fa-solid fa-filter"></i> Filter</button>
          <button @click="openMenu = !openMenu"><i class="fa-solid fa-ellipsis"></i> Show menu</button>
        </div>
      </nav>
      <board-menu @setBoardBg="setBoardBg" v-if="openMenu" />
      <!-- <div > -->
      <Container drag-class="on-dragging" orientation="horizontal" class="group-container" @drop="onGroupDrop($event)">
        <Draggable v-for="group in board.groups" :key="group.id">
          <!-- <group-preview :group="group"  @onCardDrop="onCardDrop"/> -->
          <!-- {{group.id}} -->

          <Container drag-class="on-dragging" orientation="horizontal" @drop="onCardDrop(group.id, $event)" class="shani" :get-child-payload="getCardPayload(group.id)">
            <Draggable v-for="card in group.cards" :key="card.id">
              <div>{{ card.id }}</div>
            </Draggable>
          </Container>
        </Draggable>
        <div class="open-group-container" @click="isAddGroup = true" v-if="!isAddGroup"><i class="fa-solid fa-plus"></i><span>Add another list</span></div>
        <div class="add-group-container" v-else>
          <input @keyup.enter="addGroup" v-model="groupTitle" autofocus type="text" placeholder="Enter group title" />
          <div class="add-group-actions">
            <button @click="addGroup">Add list</button><span><i class="fa-solid fa-xmark"></i></span>
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
      shani: ['1', '2', '3', '4', '5'],
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
      // const scene = Object.assign({}, this.scene)
      // scene.children = applyDrag(scene.children, dropResult)
      // this.scene = scene
    },
    // onCardDrop({ cards, groupId }) {
    //   const board = JSON.parse(JSON.stringify(this.board))
    //   const idx = this.board.groups.findIndex((group) => group.id === groupId)
    //   board.groups[idx].cards = cards
    //   this.$store.dispatch({ type: 'saveBoard', board })
    // },
    getCardPayload(groupId) {
      return (index) => {
        console.log('index', index)
        const currGroup = this.board.groups.filter((g) => g.id === groupId)[0]
        console.log('currGroup.groups', currGroup)
        return currGroup.cards[index]
        // return this.board.groups.filter((p) => p.id === groupId)[0].cards[index]
      }
    },
    async onCardDrop(gId, dropResult) {
      const board = Object.assign({}, JSON.parse(JSON.stringify(this.board)))
      const group = board.groups.filter((g) => g.id === gId)[0]
      const groupIndex = board.groups.indexOf(group)
      const newGroup = Object.assign({}, group)
      newGroup.cards = applyDrag(newGroup.cards, dropResult)
      board.groups.splice(groupIndex, 1, newGroup)
      this.board = board

      // await this.$store.dispatch({ type: 'saveBoard', board })
      // const scene = Object.assign({}, this.scene)
      // const column = scene.children.filter((p) => p.id === columnId)[0]
      // const columnIndex = scene.children.indexOf(column)
      // const newColumn = Object.assign({}, column)
      // newColumn.children = applyDrag(newColumn.children, dropResult)
      // scene.children.splice(columnIndex, 1, newColumn)
      // this.scene = scene
    },
    async setBoardBg(boardBg) {
      // this.board.style.bgImgUrl = boardBg
      const board = JSON.parse(JSON.stringify(this.board))
      board.style.bgImgUrl = boardBg
      await this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  computed: {
    boardFromStore() {
      return this.$store.getters.currBoard
    },
  },
  watch: {
    boardFromStore: {
      handler() {
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

.shani {
  flex-direction: column;
}
</style>
