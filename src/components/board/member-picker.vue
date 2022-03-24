<template>
  <custom-modal v-if="!newMember" @closeModal="closeModal">
    <template v-slot:header> Members </template>
    <input ref="input" class="custom-input" type="search" placeholder="Search members..." />
    <h4>Members</h4>
    <ul class="members-container">
      <li v-for="member in members" :key="member.id" @click="toggleMember(member.id)">
        <span class="edit-member"></span>
        <div class="member" :style="{ backgroundColor: member.color }">
          {{ member.title }}
          <span class="v-icon" v-if="currMemberIds.includes(member.id)"></span>
        </div>
      </li>
    </ul>
    <button class="custom-btn" @click="startCreating">Create new member</button>
    <hr />
    <button class="custom-btn">Enable color blind friendly mode</button>
  </custom-modal>

  <custom-modal v-else @closeModal="closeModal">
    <template v-slot:header> Create member </template>
    <form @submit.prevent="add" class="form-member">
      <member for="name">Name</member>
      <input ref="input" id="name" class="custom-input" type="search" />
      <member for="color">Select a color</member>
      <input type="color" id="color" />
      <button class="create-member-btn">Create</button>
    </form>
    <!-- <ul>
      <li v-for="member in members" :key="member.id" @click="toggleMember(member.id)">
        <span :style="{ backgroundColor: member.color }">0</span>
        <span>{{ member.title }}</span>
      </li>
    </ul> -->
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  props: {
    memberIds: Array,
  },
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      newMember: null,
      currMemberIds: this.memberIds,
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    focusInput() {
      this.$refs.input.focus()
    },
    startCreating() {
      this.newMember = {
        title: '',
        color: null,
      }
    },
    toggleMember(memberId) {
      const idx = this.currMemberIds.findIndex((lId) => lId === memberId)
      if (idx === -1) this.currMemberIds.push(memberId)
      else this.currMemberIds.splice(idx, 1)
      this.save()
    },
    // async addMember() {
    //   await this.$store.dispatch({
    //     type: 'updateCard',
    //     groupId: this.group.id,
    //     cardId: this.card.id,
    //     changes: {
    //       member: { action: 'add', value: 'l107' },
    //     },
    //   })
    // },
    // async removeMember() {
    //   await this.$store.dispatch({
    //     type: 'updateCard',
    //     groupId: this.group.id,
    //     cardId: this.card.id,
    //     changes: {
    //       member: { action: 'remove', value: 'l107' },
    //     },
    //   })
    // },
    async createMember() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          member: { action: 'create', value: this.newMember },
        },
      })
      this.newMember = null
    },
    async editMember() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          member: { action: 'edit', value: { color: '$member0', id: 'l101', title: 'SHANI!! Request' } },
        },
      })
    },
    async deleteMember() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          member: { action: 'delete', value: 'l101' },
        },
      })
    },
    save() {
      this.$emit('updateKey', 'memberIds', this.currMemberIds)
    },
  },
  computed: {
    members() {
      return this.$store.getters.currBoard.members
    },
  },
  unmounted() {},
  // emits: ['removeToy'],
}
</script>
