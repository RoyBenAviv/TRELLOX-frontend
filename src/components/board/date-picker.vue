<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Dates </template>

    <label for="reminder">Set due date reminder</label>
    <select name="reminder">
      <option>None</option>
      <option>At time of due date</option>
      <option>5 Minutes before</option>
      <option>10 Minutes before</option>
      <option>15 Minutes before</option>
      <option>1 Hour before</option>
      <option>2 Hour before</option>
      <option>1 Day before</option>
      <option>2 Day before</option>
    </select>
    <h4>Reminders will be sent to all members and watchers of this card.</h4>
    <button class="custom-btn">Save</button>
    <button class="custom-btn">Remove</button>
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
