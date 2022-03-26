<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Members </template>
    <input v-focus class="custom-input" type="text" placeholder="Search members..." />
    <h4>Board members</h4>
    <ul class="members-container">
      <li v-for="member in members" :key="member._id" @click="toggleMember(member._id)">
        <div class="member" :class="{ active: memberIds.includes(member._id) }">
          <div class="avatar-container">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
            <span v-else>{{member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0]}}</span>
          </div>
          <span>{{ member.fullname }}</span>
          <span>({{ member.username }})</span>
          <span class="v-icon"></span>
        </div>
      </li>
    </ul>
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
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    toggleMember(memberId) {
      const idx = this.memberIds.findIndex((mId) => mId === memberId)
      if (idx === -1) this.memberIds.push(memberId)
      else this.memberIds.splice(idx, 1)
      this.save()
    },
    save() {
      this.$emit('updateKey', 'memberIds', JSON.parse(JSON.stringify(this.memberIds)))
    },
  },
  computed: {
    members() {
      return this.$store.getters.currBoard.members
    },
  },
  unmounted() {},
}
</script>
