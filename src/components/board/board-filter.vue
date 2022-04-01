<template>
  <custom-modal @closeModal="closeModal" class="board-filter-body">
    <template v-slot:header> Filter </template>
    <section>
      <p>Keyword</p>
      <!-- <input v-focus v-model="filterBy.txt" class="custom-input" type="text" placeholder="Enter a keyword..." /> -->
      <p class="mini">Search cards, members, labels, and more.</p>
      <div>
        <p>Members</p>
        <ul>
          <li v-if="!filterBy.txt">
            <label>
              <input v-model="filterBy.by.none" :class="{ full: filterBy.by.none }" type="checkbox" />
              <div class="avatar-container custom">
                <i class="fa-solid fa-user"></i>
              </div>
              <span class="label-txt">No members</span>
            </label>
          </li>
          <!-- <li>
            <label>
              <input v-model="filterBy.by.me" :class="{ full: filterBy.by.me }" type="checkbox" />
              <div class="avatar-container">
                <span>X</span>
              </div>
              <span class="label-txt">Cards assigned to me</span>
            </label>
          </li> -->
          <li v-for="member in members" :key="member._id">
            <label>
              <input v-model="filterBy.by.options" :class="{ full: filterBy.by.options.includes(member._id) }" :value="member._id" type="checkbox" />
              <div class="avatar-container">
                <span>X</span>
              </div>
              <span class="label-txt">{{ member.fullname }}</span>
              <!-- <span class="label-txt">{{ member.fullname === loggedinUserFullname ? member.fullname : 'Cards assigned to me' }}</span> -->
            </label>
          </li>
          <!-- <li>
            <label>
              <input type="checkbox" />
              <div class="avatar-container">
                <span>X</span>
              </div>
              <select class="label-txt">
                <option v-for="member in members" :key="member._id" :value="member">
                  {{ member.fullname }}
                </option>
              </select>
            </label>
          </li> -->
        </ul>
      </div>
      <div>
        <p>Due date</p>
        <ul>
          <li v-if="!filterBy.txt">
            <label>
              <input v-model="filterBy.due.none" :class="{ full: filterBy.due.none }" type="checkbox" />
              <div class="avatar-container custom">
                <i class="fa-solid fa-user"></i>
              </div>
              <span class="label-txt">No dates</span>
            </label>
          </li>
          <li>
            <label>
              <input v-model="filterBy.due.over" :class="{ full: filterBy.due.over }" type="checkbox" />
              <div class="avatar-container">
                <span>X</span>
              </div>
              <span class="label-txt">Over due</span>
            </label>
          </li>
          <li>
            <label>
              <input v-model="filterBy.due.tommarow" :class="{ full: filterBy.due.tommarow }" type="checkbox" />
              <div class="avatar-container">
                <span>X</span>
              </div>
              <span class="label-txt">Due in the next day</span>
            </label>
          </li>
        </ul>
      </div>
      <div v-if="labels.length">
        <p>Labels</p>
        <ul>
          <li v-if="!filterBy.txt">
            <label>
              <input v-model="filterBy.label.none" :class="{ full: filterBy.label.none }" type="checkbox" />
              <div class="avatar-container custom">
                <i class="fa-solid fa-user"></i>
              </div>
              <span class="label-txt">No labels</span>
            </label>
          </li>
          <li v-for="label in labels" :key="label.id">
            <label>
              <input v-model="filterBy.label.options" :class="{ full: filterBy.label.options.includes(label.id) }" :value="label.id" type="checkbox" />
              <span class="label-txt">{{ label.title }}</span>
            </label>
          </li>
        </ul>
      </div>
      {{ filterBy.label.options }}
      {{ filterBy.by.options }}
    </section>
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
      filterBy: {
        by: {
          none: false,
          options: [],
        },
        due: {
          none: false,
          over: false,
          tommarow: false,
        },
        label: {
          none: false,
          options: [],
        },
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    updateKey() {
      this.$emit('updateKey', 'filterBy', this.filterBy)
    },
  },
  computed: {
    members() {
      return this.$store.getters.currBoard.members
    },
    labels() {
      return this.$store.getters.currBoard.labels
    },
    loggedinUserFullname() {
      return 'Shani Kupiec'
    },
  },
  unmounted() {},
  watch: {
    filterBy: {
      handler() {
        this.updateKey()
      },
      deep: true,
    },
  },
}
</script>
