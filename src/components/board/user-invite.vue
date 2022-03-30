<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Invite to board </template>
    <input v-focus v-model="filterBy" class="custom-input" type="text" placeholder="Email address or name..." />
    <ul>
        <!-- <li v-for="user in users" :key="user._id">{{user.fullname}}</li> -->
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      filterBy: '',
      users: this.$store.getters.users
    }
  },
  methods: {
    // closeModal() {
    //   this.$emit('closeModal')
    // },
    // toggleMember(memberId, fullname) {
    //   var activity = ''
    //   const idx = this.memberIds.findIndex((mId) => mId === memberId)
    //   if (idx === -1){
    //     this.memberIds.push(memberId)
    //     activity = `${fullname} joined this card`
    //   } else {
    //     this.memberIds.splice(idx, 1)
    //     activity = `${fullname} left this card`
    //   }
    //   this.save(activity)
    // },
    // save(activity) {
    //   this.$emit('updateKey', 'memberIds', JSON.parse(JSON.stringify(this.memberIds)), activity)
    // },
  },
  computed: {
    members() {
    //   var members = this.$store.getters.currBoard.members
    //   if (!this.filterBy) return members
    //   const regex = new RegExp(this.filterBy, 'i')
    //   return members.filter((m) => regex.test(m.fullname) || regex.test(m.username))
    },
  },
  unmounted() {},
}
</script>