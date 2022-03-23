<template>
  <section v-if="board" class="board-view">
      <nav class="board-nav">
        <div class="left-nav">
        <h2>{{ board.title }}</h2><button><i class="fa-solid fa-star"></i></button> | 
        <div class="members-container">
            <div class="members">
                <div class="member-pic"></div><div class="member-pic"></div><div class="member-pic"></div>
            </div>
          
          <button class="invite"><i class="fa-solid fa-user-plus"></i> Invite</button>
        </div>
        </div>
        <div class="right-nav">
          <button><i class="fa-solid fa-filter"></i> Filter</button>
          <button><i class="fa-solid fa-ellipsis"></i> Show menu</button>

        </div>
      </nav>
    <div class="group-container">
      <group-preview v-for="group in board.groups" :key="group.id" :group="group"></group-preview>
      <div class="open-group-container" @click="isAddGroup = true" v-if="!isAddGroup"><i class="fa-solid fa-plus"></i><span>Add another list</span></div>
      <div class="add-group-container" v-else>
        <input @keyup.enter="addGroup" v-model="groupTitle" autofocus type="text" placeholder="Enter group title" />
        <div class="add-group-actions">
        <button @click="addGroup">Add list</button><span><i class="fa-solid fa-xmark"></i></span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </section>

</template>

<script>
import groupPreview from '../components/board/group-preview.vue'
// import { Container, Draggable } from "vue3-smooth-dnd";

export default {
  components: {
    groupPreview,
    // Container,
    // Draggable
  },
  data() {
    return {
      isAddGroup: false,
      groupTitle: '',
    }
  },
  async created() {
    const { boardId } = this.$route.params
    await this.$store.dispatch({ type: 'setCurrBoard', boardId })
  },
  methods: {
    addGroup() {
      this.$store.dispatch({ type: 'addGroup', title: this.groupTitle})
      this.groupTitle = ''
    },
  },
  computed: {
    board() {
      return this.$store.getters.currBoard
    }
  },
  unmounted() {},
}
</script>
