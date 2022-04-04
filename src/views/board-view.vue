<template>
  <section v-if="board" class="scroll-wrapper" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }">
    <div class="board-wrapper">
      <app-header :class="headerClr?.isDark || !headerClr ? 'white-color' : 'dark-color'" :style="{ 'background-color': headerClr ? headerClr.hex : board.style.bgHeader }" class="board-header" />
      <div class="board-view">
        <nav :class="headerClr?.isDark || !headerClr ? 'white-color' : 'dark-color'" class="board-nav">
          <div class="left-nav">
            <h2 v-if="!editTitle" @click="editTitle = true">{{ board.title }}</h2>
            <input v-else :style="'width:' + board.title.length * 12 + 'px'" class="custom-input, title-input" type="text" v-focus v-model="board.title" @keyup.enter="editBoardTitle" v-click-outside="() => editBoardTitle()" />
            <button class="star" :class="{ full: board.isStarred }" @click="updateKey('isStarred', 'toggle')"></button>
            <span class="seperator">|</span>
            <container v-if="members.length" style="height: 32px" class="members-container" orientation="horizontal" group-name="3" :get-child-payload="getChildPayload">
              <draggable @mousedown="this.$store.commit({ type: 'memberDrag', isDrag: true })" style="height: 32px" class="avatar-container" v-for="member in members" :key="member._id" :title="member.fullname">
                <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
                <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
              </draggable>
            </container>
            <button class="invite" @click="openInviteModal()"><span>Invite</span></button>
            <user-invite v-if="openInvite" v-click-outside="() => (openInvite = false)" @closeModal="openInvite = false"></user-invite>
          </div>
          <div class="right-nav">
            <button @click="openDashboard" class="dashboard-btn"><i class="fa-solid fa-chart-line"></i><span>Dashboard</span></button>
            <button @click="openFilter = !openFilter" class="filter" :class="{ active1: openFilter, active2: this.filteringCount > -1 }">
              <i class="fa-solid fa-filter"></i>
              <span>Filter</span>
              <span v-if="this.filteringCount > -1" class="filterCount">{{ this.filteringCount }}</span>
              <span v-if="this.filteringCount > -1" class="filterRestart" @click.stop="resetFilter"></span>
            </button>
            <button class="menu" @click="openMenu = !openMenu"><i class="fa-solid fa-ellipsis"></i> <span>Show menu</span></button>
          </div>
          <boardFilter v-if="openFilter" @updateKey="updateKey" @closeModal="openFilter = false" v-click-outside="() => (openFilter = false)"></boardFilter>
        </nav>
        <Transition name="menu">
          <board-menu @closeMenu="openMenu = false" @setBoardClr="setBoardClr" @setBoardBg="setBoardBg" v-if="openMenu" />
        </Transition>
        <div class="loading-board" v-if="isLoading">
          <h1 :style="{ color: headerClr?.isDark || !headerClr ? 'white' : '#091e42' }">TRELLOX</h1>
          <img src="https://res.cloudinary.com/trellox/image/upload/v1648921970/loading_thf5st.gif" />
        </div>
        <Container v-else drag-class="on-dragging" orientation="horizontal" class="group-container" @drop="onGroupDrop($event)">
          <Draggable v-for="group in board.groups" :key="group.id">
            <group-preview :group="group" @onCardDrop="onCardDrop" />
          </Draggable>
          <div :style="{ color: headerClr?.isDark || !headerClr ? 'white' : '#091e42' }" class="open-group-container" @click="isAddGroup = true" v-if="!isAddGroup"><i class="fa-solid fa-plus"></i><span>Add another list</span></div>
          <div class="add-group-container" v-else>
            <input @keyup.enter="addGroup" v-model="groupTitle" v-focus type="text" placeholder="Enter list title..." />
            <div class="add-group-actions">
              <button @click="addGroup">Add list</button><span @click="isAddGroup = false"><i class="fa-solid fa-xmark"></i></span>
            </div>
          </div>
        </Container>
        <Transition name="dashboard">
          <router-view></router-view>
        </Transition>
      </div>
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
import { socketService } from '../services/socket.service'

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
      headerClr: null,
      filteringCount: -1,
    }
  },
  async created() {
    const { boardId } = this.$route.params

    socketService.emit('board room', boardId)
    socketService.emit('setMemberJoin', this.$store.getters.loggedinUser?._id || '')

    socketService.on('updateMembersCount', (users) => {
      console.log('user ids watching this board now: ', users)
      this.$store.commit({ type: 'setOnlineUsersOnBoard', users })
    })

    this.board = await this.$store.dispatch({ type: 'setCurrBoard', boardId })
    this.updateKey('recentlyViewed', Date.now())
    var board = JSON.parse(JSON.stringify(this.board))
    const fac = new FastAverageColor()
    if (board.style.bgImgUrl) this.headerClr = await fac.getColorAsync(board.style.bgImgUrl)
    //set filter
    board = this.filter(board)
    await this.$store.dispatch({ type: 'saveBoard', board })
    this.board = board
  },
  methods: {
    async updateKey(key, value) {
      var board = JSON.parse(JSON.stringify(this.board))
      if (value === 'toggle') {
        board[key] = !board[key]
      } else board[key] = value
      if (key === 'filterBy') board = this.filter(board)
      await this.$store.dispatch({ type: 'saveBoard', board })
      this.board = board
    },
    calcIfTomorrow(due) {
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
    getChildPayload(idx) {
      return this.$store.getters.currBoard.members[idx]
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
      if (!this.board.title) return
      const board = JSON.parse(JSON.stringify(this.board))
      this.$store.dispatch({ type: 'saveBoard', board })
    },
    filter(board) {
      const filterBy = board.filterBy
      const startVal =
        filterBy.by.none === false && filterBy.by.options.length === 0 && filterBy.due.none === false && filterBy.due.over === false && filterBy.due.tomorrow === false && filterBy.label.none === false && filterBy.label.options.length === 0
      if (startVal) {
        this.filteringCount = -1
        board.groups = board.groups.map((group) => {
          group.cards = group.cards.map((card) => {
            card.isShown = startVal
            return card
          })
          return group
        })
        return board
      }
      this.filteringCount = 0
      board.groups = board.groups.map((group) => {
        group.cards = group.cards.map((card) => {
          var condition = [false, false, false]
          var match = [false, false, false]
          if (filterBy.by.none) {
            condition[0] = true
            if (card.memberIds.length === 0) match[0] = true
          }
          if (filterBy.by.options.length) {
            condition[0] = true
            var members = card.memberIds.filter((memberId) => filterBy.by.options.includes(memberId))
            if (members.length > 0) match[0] = true
          }

          if (filterBy.due.none) {
            condition[1] = true
            if (card.dueDate) match[1] = true
          }
          if (filterBy.due.over) {
            condition[1] = true
            if (card.dueDate > Date.now()) match[1] = true
          }
          if (filterBy.due.tomorrow) {
            condition[1] = true
            if (this.calcIfTomorrow(card.dueDate)) match[1] = true
          }

          if (filterBy.label.none) {
            condition[2] = true
            if (card.labelIds.length === 0) match[2] = true
          }
          if (filterBy.label.options.length) {
            condition[2] = true
            var labels = card.labelIds.filter((labelId) => filterBy.label.options.includes(labelId))
            if (labels.length > 0) match[2] = true
          }
          if (condition[0] === match[0] && condition[1] === match[1] && condition[2] === match[2]) {
            this.filteringCount++
            card.isShown = true
          } else card.isShown = false
          return card
        })
        return group
      })
      return board
    },
    resetFilter() {
      const emptyFilterBy = {
        by: {
          none: false,
          options: [],
        },
        due: {
          none: false,
          over: false,
          tomorrow: false,
        },
        label: {
          none: false,
          options: [],
        },
      }
      this.updateKey('filterBy', emptyFilterBy)
    },
    openDashboard() {
      const currRoute = this.$router.currentRoute._value.fullPath
      this.$router.push(`${currRoute}/dashboard`)
    },
    openInviteModal() {
      this.openInvite = true
    },
  },
  computed: {
    boardFromStore() {
      return this.$store.getters.currBoard
    },
    members() {
      return this.$store.getters.currBoard.members
    },
    isLoading() {
      return this.$store.getters.isLoading
    },
  },
  unmounted() {
    socketService.emit('setMemberLeave', this.$store.getters.loggedinUser?._id || '')
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

.dashboard-enter-active,
.dashboard-leave-active {
  transition: opacity 0.3s ease;
}

.dashboard-enter-from,
.dashboard-leave-to {
  opacity: 0;
}
</style>
