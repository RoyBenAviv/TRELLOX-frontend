<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Filter </template>
    <section class="board-filter-body">
      <p>Keyword</p>
      <input v-focus v-model="filterBy.txt" class="custom-input" type="text" placeholder="Enter a keyword..." />
      <p class="mini">Search cards, members, labels, and more.</p>
      <div v-if="!filterBy.txt">
        <p>Members</p>
        <ul>
          <li>
            <label>
              <input v-model="filterBy.by.noOne" :class="{ full: filterBy.by.noOne }" type="checkbox" />
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
      <div v-else>
        <ul v-if="members.length">
          <p>Members</p>
          <li v-for="member in members" :key="member._id" @click="toggleMember(member._id)">
            <div class="member" :class="{ active: memberIds.includes(member._id) }">
              <div class="avatar-container">
                <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
                <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
              </div>
              <span>{{ member.fullname }}</span>
              <span>({{ member.username }})</span>
              <span class="v-icon"></span>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <p>Due date</p>
        <ul>
          <li>
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
          <li>
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
import { ref } from 'vue'

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
        txt: '',
        by: {
          noOne: false,
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
      checked1: ref(true),
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
  },
  computed: {
    members() {
      console.log('this.$store.getters.currBoard.members', this.$store.getters.currBoard.members)
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
}
</script>
