<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Members </template>
    <input ref="input" class="custom-input" type="search" placeholder="Search members..." />
    <h4>Board members</h4>
    <ul class="members-container">
      <li v-for="member in members" :key="member._id" @click="toggleMember(member._id)">
        <div class="member" :class="{ active: memberIds.includes(member._id) }">
          <!-- <img :src="member.imgUrl" alt=""> -->
          <span class="avatar-container">
            <span>SK</span>
          </span>
          <span>{{member.fullname}}</span>
          <span>({{member.username}})</span>
          <span class="v-icon"></span>
        </div>
      </li>
    </ul>
    <!-- {{memberIds}} -->
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  props: {
    currMemberIds: Array,
  },
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      newMember: null,
      memberIds: JSON.parse(JSON.stringify(this.currMemberIds)),
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    focusInput() {
      this.$refs.input.focus()
    },
    toggleMember(memberId) {
      const idx = this.memberIds.findIndex((mId) => mId === memberId)
      // console.log('idx',idx)
      // console.log(memberId);
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
  // emits: ['removeToy'],
}
</script>
