<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Invite to board </template>
    <input v-focus v-model="filterBy" @input="filterUsers" class="custom-input" type="text" placeholder="Email address or name..." />
    <ul>
        <li v-for="user in users" :key="user._id">{{user.fullname}}</li>
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  components: {
    customModal,
  },
  async created() {
      await this.$store.dispatch('loadUsers')
      this.users = JSON.parse(JSON.stringify(this.$store.getters.users))
  },
  data() {
    return {
      filterBy: '',
      users: []
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    filterUsers() {
        const regex = new RegExp(this.filterBy, 'i');
        this.users = this.users.filter(user => (regex.test(user.fullname) || regex.test(user.email)))
    }
  },
  computed: {
    members() {
    },
  },
  unmounted() {},
}
</script>