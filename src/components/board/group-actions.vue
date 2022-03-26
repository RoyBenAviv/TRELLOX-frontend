<template>
  <section class="group-actions">
    <div class="grp-act-header">
      <p>List actions</p>
      <span @click="closeGrpAct"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <div v-if="!openCopyGroup && !openMoveGroup && !openMoveCards">
      <ul>
        <li @click="addCard"><a>Add card...</a></li>
        <li @click.stop="openCopyGroup = true"><a>Copy list...</a></li>
        <li @click.stop="openMoveGroup = true"><a>Move list...</a></li>
      </ul>
      <ul>
        <hr />
        <li><a>Sort By...</a></li>
        <hr />
      </ul>
      <ul>
        <li @click.stop="openMoveCards = true"><a>Move all cards in this list...</a></li>
        <li @click="archiveCards"><a>Archive all cards in this list...</a></li>
      </ul>
      <ul>
        <hr />
        <li @click="archiveGroup"><a>Archive this list</a></li>
      </ul>
    </div>
    <div class="copy-group" v-if="openCopyGroup">
    
      <input v-focus v-model="groupTitle" type="text" placeholder="Enter list title"/>
      <button @click="copyGroup">Create list</button>
    </div>

    <div class="move-group" v-if="openMoveGroup">
      <form @submit.prevent="moveGroup">
        <label>
          <div class="board-info">
            <p>Board</p>
            <p>{{ chosenBoard.title }}</p>
            <select v-model="chosenBoard">
              <option v-for="board in boards" :key="board._id" :value="board">{{ board.title }}</option>
            </select>
          </div>
        </label>
        <label>
          <div class="board-info">
            <p>Position</p>
            <p>{{ groupPos + 1 }}</p>
            <select v-model="groupPos">
              <option v-for="(group, idx) in chosenBoard.groups" :key="group" :value="idx">{{ idx + 1 }}</option>
            </select>
          </div>
        </label>
        <button>Save</button>
      </form>
    </div>

    <div v-if="openMoveCards">
      <ul>
        <li @click="moveAllCards(group)" v-for="group in currentGroups" :key="group.id">{{group.title}}</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'group-actions',
  data() {
    return {
      groupTitle: '',
      openCopyGroup: false,
      openMoveGroup: false,
      openMoveCards: false,
      currentGroups: this.$store.getters.currBoard.groups,
      chosenBoard: this.$store.getters.currBoard,
      groupPos: null,
    }
  },
  methods: {
    addCard() {
      this.$emit('addCard')
    },
    archiveGroup() {
      this.$emit('archiveGroup')
    },
    copyGroup() {
      this.$emit('copyGroup', this.groupTitle)
      this.groupTitle = ''
    },
    moveGroup() {
      const moveToBoard = this.boards.find((board) => board._id === this.chosenBoard._id)
      this.$emit('moveGroup', moveToBoard, this.groupPos)
    },
    moveAllCards(group) {
      this.$emit('moveAllCards', group)
    },
    archiveCards() {
      this.$emit('archiveCards')
    },
    closeGrpAct() {
      this.$emit('closeGrpAct')
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
  components: {},
}
</script>

<style></style>
