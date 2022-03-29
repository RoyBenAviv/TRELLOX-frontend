<template>
  <custom-modal class="date-picker" @closeModal="closeModal">
    <template v-slot:header> Dates </template>
    <div class="calendar-container">
      <DatePicker v-model="date" />
    </div>

    <!-- <label>Set due date reminder
    <select>
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
    </label> -->
    <h4>Due date</h4>
    <div class="date-options">
      <input disabled type="date" v-model="readDate" class="custom-input" />
      <input type="time" class="custom-input" v-model="time" />
    </div>

    <h4>Reminders will be sent to all members and watchers of this card.</h4>
    <button @click="setDate" class="custom-btn save">Save</button>
    <button @click="removeDate" class="custom-btn">Remove</button>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
import { Calendar, DatePicker } from 'v-calendar'
export default {
  props: {
    card: Object,
  },
  components: {
    customModal,
    Calendar,
    DatePicker,
  },
  created() {},
  data() {
    return {
      date: new Date(),
      time: null
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    setDate() {
      if(!this.time) this.time = '00:00'
      const dueDate = {
        date: this.date,
        time: this.time,
        isCompleted: null,
      }
      this.$emit('updateKey', 'dueDate', JSON.parse(JSON.stringify(dueDate)))
    },
    removeDate() {
      const dueDate = null
      this.$emit('updateKey', 'dueDate', JSON.parse(JSON.stringify(dueDate)))
    },
  },
  computed: {
    readDate() {
      const day = this.date.getDate()
      const month = this.date.getMonth() + 1
      const year = this.date.getFullYear()
      const dayStr = day < 10 ? '0' + day : day
      const monthStr = month < 10 ? '0' + month : month
      return `${year}-${monthStr}-${dayStr}`
    },
  },
  unmounted() {},
}
</script>
