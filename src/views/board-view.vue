<template>
  <section class="board-wrapper" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }" v-if="board">
    <app-header :class="headerClr?.isDark || !headerClr ? 'white-color' : 'dark-color'" :style="{ 'background-color': headerClr ? headerClr.hex : board.style.bgHeader }" class="board-header" />
    <div class="board-view">
      <nav :class="headerClr?.isDark || !headerClr ? 'white-color' : 'dark-color'" class="board-nav">
        <div class="left-nav">
          <h2 v-if="!editTitle" @click="editTitle = true">{{ board.title }}</h2>
          <input :style="('width:' + (board.title.length * 12) + 'px' )" v-else class="custom-input" type="text" v-focus v-model="board.title" @keyup.enter="editBoardTitle" v-click-outside="()=> editBoardTitle()"/>
          <button class="star" :class="{ full: board.isStarred }" @click="updateKey('isStarred', 'toggle')"></button>
          <span class="seperator">|</span>
          <div class="members-container">
            <div class="avatar-container" v-for="member in members" :key="member.id" :title="member.fullname">
              <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
              <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
            </div>
          </div>
          <button class="invite" @click="openInvite = true">Invite</button>
          <user-invite v-if="openInvite" v-click-outside="() => (openInvite = false)" @closeModal="openInvite = false"></user-invite>
        </div>
        <div class="right-nav">
          <button @click="openFilter = !openFilter"><i class="fa-solid fa-filter"></i> Filter</button>
          <button @click="openMenu = !openMenu"><i class="fa-solid fa-ellipsis"></i> Show menu</button>
        </div>
        <boardFilter v-if="openFilter" @updateKey="updateKey" @closeModal="openFilter = false" v-click-outside="() => (openFilter = false)"></boardFilter>
      </nav>
      <Transition name="menu">
        <board-menu @closeMenu="openMenu = false" @setBoardClr="setBoardClr" @setBoardBg="setBoardBg" v-if="openMenu" />
      </Transition>
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
import boardFilter from '../components/board/board-filter.vue'
import userInvite from '../components/board/user-invite.vue'
import FastAverageColor from 'fast-average-color'

export default {
  components: {
    groupPreview,
    Container,
    Draggable,
    appHeader,
    boardMenu,
    boardFilter,
    userInvite,
  },
  data() {
    return {
      isAddGroup: false,
      groupTitle: '',
      board: null,
      openMenu: false,
      savingGroup: false,
      lastBoard: null,
      groupsCount: 0,
      openFilter: false,
      openInvite: false,
      editTitle: false,
      headerClr: null
    }
  },
  async created() {
    const { boardId } = this.$route.params
    this.board = await this.$store.dispatch({ type: 'setCurrBoard', boardId })
    this.updateKey('recentlyViewed', Date.now())
    const board = JSON.parse(JSON.stringify(this.board))
    const fac = new FastAverageColor()
    this.headerClr = await fac.getColorAsync(board.style.bgImgUrl)
  },
  methods: {
    async updateKey(key, value) {
      const board = JSON.parse(JSON.stringify(this.board))
      if (value === 'toggle') {
        board[key] = !board[key]
      } else board[key] = value
      await this.$store.dispatch({ type: 'saveBoard', board })
      this.board = board
    },
    calcIfTommarow(due) {
      const dueInDate = new Date(due)
      const dateInDate = new Date(Date.now())
      var countTo12 = dueInDate.getHours() * 60 * 60 * 1000
      due -= countTo12
      var x = due - Date.now()
      const bool1 = x - 24 * 60 * 60 * 1000 < 0
      const bool2 = due > Date.now()
      const bool3 = dueInDate.getDay() !== dateInDate.getDay()
      return bool1 && bool2 && bool3
    },
    async addGroup() {
      if (!this.groupTitle) return
      await this.$store.dispatch({ type: 'addGroup', title: this.groupTitle })
      this.groupTitle = ''
    },
    async onGroupDrop(dropResult) {
      try {
        const board = Object.assign({}, this.board)
        board.groups = applyDrag(board.groups, dropResult)
        this.lastBoard = JSON.parse(JSON.stringify(this.board))
        this.board = board
        await this.$store.dispatch({ type: 'saveBoard', board })
      } catch (err) {
        console.log('err', err)
        this.board = this.lastBoard
      }
    },
    async onCardDrop({ cards, groupId }) {
      try {
        const board = JSON.parse(JSON.stringify(this.board))
        const idx = this.board.groups.findIndex((group) => group.id === groupId)
        board.groups[idx].cards = cards
        if (this.groupsCount === 0) {
          this.lastBoard = JSON.parse(JSON.stringify(this.board))
        }
        this.board = board
        this.groupsCount++
        if (this.groupsCount === this.board.groups.length) {
          await this.$store.dispatch({ type: 'saveBoard', board })
          this.groupsCount = 0
        }
      } catch (err) {
        console.log('err', err)
        this.board = this.lastBoard
      }
    },
    async setBoardBg(boardBg) {
      // this.board.style.bgImgUrl = boardBg
      const board = JSON.parse(JSON.stringify(this.board))
      board.style.bgColor = ''
      board.style.bgHeader = ''
      board.style.bgImgUrl = boardBg
      const fac = new FastAverageColor()
      this.headerClr = await fac.getColorAsync(board.style.bgImgUrl)
      console.log(this.headerClr)
      this.$store.dispatch({ type: 'saveBoard', board })
    },
    setBoardClr(boardClr) {
      const board = JSON.parse(JSON.stringify(this.board))
      board.style.bgImgUrl = ''
      board.style.bgColor = boardClr.body
      board.style.bgHeader = boardClr.header
      this.headerClr = null
      this.$store.dispatch({ type: 'saveBoard', board })
    },
    editBoardTitle() {
      this.editTitle = false
      if(!this.board.title) return
      const board = JSON.parse(JSON.stringify(this.board))
      this.$store.dispatch({ type: 'saveBoard', board })
    },
    _filter(board) {
      const filterBy = board.filterBy
      logger.info('filterBy', filterBy)
      if (filterBy.by.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.memberIds.length === 0)
          return group
        })
        logger.info('filterBy.by.none')
      } else {
        if (filterBy.by.options.length) {
          board.groups = board.groups.map((group) => {
            group.cards = group.cards.filter((card) => {
              card.memberIds = card.memberIds.filter((memberId) => filterBy.by.options.includes(memberId))
              if (card.memberIds.length) return card
            })
            return group
          })
          logger.info('filterBy.by.options')
        }
      }
      if (filterBy.due.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => !card.dueDate)
          return group
        })
      } else if (filterBy.due.over) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.dueDate > Date.now())
          return group
        })
      } else if (filterBy.due.tommarow) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => this.calcIfTommarow(card.dueDate))
          return group
        })
      }
      if (filterBy.label.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.labelIds.length === 0)
          return group
        })
      } else {
        if (filterBy.label.options.length) {
          board.groups = board.groups.map((group) => {
            group.cards = group.cards.filter((card) => {
              card.labelIds = card.labelIds.filter((labelId) => filterBy.label.options.includes(labelId))
              if (card.labelIds.length) return card
            })
            return group
          })
        }
      }
      return board
    },
  },
  computed: {
    boardFromStore() {
      var board = this.$store.getters.currBoard
      if(!board) return null
      console.log('board', board)
      // const filterBy = {
      //   by: {
      //     none: false,
      //     options: [],
      //   },
      //   due: {
      //     none: false,
      //     over: false,
      //     tommarow: false,
      //   },
      //   label: {
      //     none: false,
      //     options: [],
      //   },
      // }
      // board.filterBy = board.filterBy ? board.filterBy : filterBy
      const filterBy = board.filterBy
      // logger.info('filterBy', filterBy)
      if (filterBy.by.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.memberIds.length === 0)
          return group
        })
        console.log('board',board)
        console.log('without members');
      } else {
        if (filterBy.by.options.length) {
          board.groups = board.groups.map((group) => {
            group.cards = group.cards.filter((card) => {
              card.memberIds = card.memberIds.filter((memberId) => filterBy.by.options.includes(memberId))
              if (card.memberIds.length) return card
            })
            return group
          })
          // logger.info('filterBy.by.options')
        }
      }
      if (filterBy.due.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => !card.dueDate)
          return group
        })
      } else if (filterBy.due.over) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.dueDate > Date.now())
          return group
        })
      } else if (filterBy.due.tommarow) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => this.calcIfTommarow(card.dueDate))
          return group
        })
      }
      if (filterBy.label.none) {
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.filter((card) => card.labelIds.length === 0)
          return group
        })
      } else {
        if (filterBy.label.options.length) {
          board.groups = board.groups.map((group) => {
            group.cards = group.cards.filter((card) => {
              card.labelIds = card.labelIds.filter((labelId) => filterBy.label.options.includes(labelId))
              if (card.labelIds.length) return card
            })
            return group
          })
        }
      }
      return board
    },
    members() {
      return this.$store.getters.currBoard.members
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
  transform: rotate(6deg);
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
