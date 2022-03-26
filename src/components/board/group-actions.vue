<template>
  <section class="group-actions">
    <div class="grp-act-header">
      <p>List actions</p>
      <span @click="closeGrpAct"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <ul>
      <li @click="addCard"><a>Add card...</a></li>
      <li @click="openCopyGroup = true">
        <a>Copy list...</a>

        <div v-if="openCopyGroup">
          <input v-model="groupTitle" type="text" />
          <button @click="copyGroup"></button>
        </div>
      </li>
      <li @click="openMoveGroup = true">
      <a>Move list...</a>
      
        <div v-if="openMoveGroup">
            <form @submit.prevent="moveGroup">

            <select v-model="chosenBoard">
                <!-- <optgroup label="Boards">
                    <option selected="selected">{{chosenBoard.title}}</option>
                </optgroup> -->
                <option v-for="board in boards" :key="board._id" :value="board">{{board.title}}</option>
            </select>
            <select v-model="groupPos">
                <option v-for="(group, idx) in chosenBoard.groups" :key="group" :value="idx">{{idx + 1}}</option>

            </select>
            <button>Save</button>
            </form>
            

        </div>
      </li>
    </ul>
    <ul>
      <hr />
      <li><a>Sort By...</a></li>
      <hr />
    </ul>
    <ul>
      <li @click="openMoveCards = true"><a>Move all cards in this list...</a>
      
        <div v-if="openMoveCards">
            <select v-model="chosenGroup" @change="moveAllCards">
                <option v-for="group in currentGroups" :key="group.id" :value="group">{{group.title}}</option>


            </select>
        </div>
      
      </li>
      <li @click="archiveCards"><a>Archive all cards in this list...</a></li>
    </ul>
    <ul>
      <hr />
      <li @click="archiveGroup"><a>Archive this list</a></li>
    </ul>
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
      chosenGroup: null,
      groupPos: null
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
        const moveToBoard = this.boards.find(board => board._id === this.chosenBoard._id)
        this.$emit('moveGroup', moveToBoard, this.groupPos)
    },
    moveAllCards() {
        this.$emit('moveAllCards', this.chosenGroup)
    },
    archiveCards() {
      this.$emit('archiveCards')
    },
    closeGrpAct() {
      this.$emit('closeGrpAct')
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
