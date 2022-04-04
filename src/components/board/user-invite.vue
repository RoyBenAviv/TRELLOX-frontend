<template>
  <custom-modal @closeModal="closeModal" class="user-invite">
    <template v-slot:header> Invite to board </template>
    <input v-focus v-model="filterBy" @input="filterUsers" class="custom-input" type="text" placeholder="Email address or name..." />
    <div class="users-container">
      <div class="users"  v-for="user in users" :key="user._id" @click="inviteUser(user)">
        <div class="user-container">
          <div class="user">
            <div class="avatar">
              <div class="img">
                <span v-if="user.imgUrl" :style="`background-image: url('${user.imgUrl}')`"></span>
                <span v-else>
                  {{user.fullname.split(' ')[0].split('')[0] + user.fullname.split(' ')[1].split('')[0]}}
                </span>
              </div>
            </div>
            <div class="user-info">
              <div class="fullname">{{user.fullname}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  components: {
    customModal,
  },
  data() {
    return {
      filterBy: '',
      users: ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    filterUsers() {
      this.users = this.$store.getters.users
        const regex = new RegExp(this.filterBy, 'i');
        this.users = this.users.filter(user => (regex.test(user.fullname) || regex.test(user.email)))
    },
    inviteUser(user) {
      const board = JSON.parse(JSON.stringify(this.$store.getters.currBoard))
      const memberCheck = board.members.reduce((acc, member) => {
        if(member._id === user._id) acc++
        return acc
      }, 0)
      if(memberCheck) return
      board.members.push(user)
      this.$store.dispatch({type: 'saveBoard', board})
    }
  },
  computed: {
    members() {
    },
  },
  unmounted() {},
}
</script>