<template>
  <section class="group-actions">
    <div class="grp-act-header">
      <p>List actions</p>
      <span @click="closeGrpAct"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <div v-if="!openCopyGroup && !openMoveGroup && !openMoveCards && !openSortCards">
      <ul>
        <li @click="addCard"><a>Add card...</a></li>
        <li @click.stop="openCopyGroup = true"><a>Copy list...</a></li>
        <li @click.stop="openMoveGroup = true"><a>Move list...</a></li>
      </ul>
      <ul>
        <hr v-if="isSort" />
        <li v-if="isSort" @click.stop="openSortCards = true"><a>Sort By...</a></li>
        <hr />
      </ul>
      <ul>
        <li @click.stop="openMoveCards = true"><a>Move all cards in this list...</a></li>
        <li @click="removeCards"><a>Remove all cards in this list...</a></li>
      </ul>
      <ul>
        <hr />
        <li @click="removeGroup"><a>Remove this list</a></li>
      </ul>
    </div>
    <div class="copy-group" v-if="openCopyGroup">
      <input v-focus v-model="groupTitle" type="text" placeholder="Enter list title" />
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
        <li @click="moveAllCards(group)" v-for="group in currentGroups" :key="group.id">{{ group.title }}</li>
      </ul>
    </div>

    <div v-if="openSortCards">
      <ul class="sort">
        <li @click="sortBy('createdNew')">Date created (newest first)</li>
        <li @click="sortBy('createdOld')">Date created (oldest first)</li>
        <li @click="sortBy('name')">Card name (alphabetically)</li>
        <li @click="sortBy('dueDate')">Due date</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'group-actions',
  props: {
    isSort: Boolean,
  },
  data() {
    return {
      groupTitle: '',
      openCopyGroup: false,
      openMoveGroup: false,
      openMoveCards: false,
      openSortCards: false,
      currentGroups: this.$store.getters.currBoard.groups,
      chosenBoard: this.$store.getters.currBoard,
      groupPos: null,
    }
  },
  methods: {
    addCard() {
      this.$emit('addCard')
    },
    removeGroup() {
      this.$emit('removeGroup')
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
    removeCards() {
      this.$emit('removeCards')
    },
    closeGrpAct() {
      this.$emit('closeGrpAct')
    },
    sortBy(sortBy){
      this.$emit('sortBy', sortBy)
    }
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
