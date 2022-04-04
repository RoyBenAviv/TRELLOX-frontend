<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Members </template>
    <input v-focus v-model="filterBy" class="custom-input" type="text" placeholder="Search members..." />
    <h4>Board members</h4>
    <ul v-if="members.length" class="members-container">
      <li v-for="member in members" :key="member._id" @click="toggleMember(member._id, member.fullname)">
        <div class="member" :class="{ active: memberIds.includes(member._id) }">
          <div class="avatar-container">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
            <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
          </div>
          <div class="member-info">
          <span>{{ member.fullname }}</span>
          <span>({{ member.username }})</span>
          </div>

          <span class="v-icon"></span>
        </div>
      </li>
    </ul>
    <p v-else class="msg-no-members">Looks like that person isn't a member yet. Enter their email address to add them to the card and board.</p>
    <!-- <button v-if="members.length" class="custom-btn">Show other Workspace members</button> -->
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  props: {
    card: Object,
  },
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      newMember: null,
      memberIds: JSON.parse(JSON.stringify(this.card.memberIds)),
      filterBy: '',
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    toggleMember(memberId, fullname) {
      var activity = ''
      const idx = this.memberIds.findIndex((mId) => mId === memberId)
      if (idx === -1){
        this.memberIds.push(memberId)
        activity = `${fullname} joined this card`
      } else {
        this.memberIds.splice(idx, 1)
        activity = `${fullname} left this card`
      }
      this.save(activity)
    },
    save(activity) {
      this.$emit('updateKey', 'memberIds', JSON.parse(JSON.stringify(this.memberIds)), activity)
    },
  },
  computed: {
    members() {
      var members = this.$store.getters.currBoard.members
      if (!this.filterBy) return members
      const regex = new RegExp(this.filterBy, 'i')
      return members.filter((m) => regex.test(m.fullname) || regex.test(m.username))
    },
  },
  unmounted() {},
}
</script>