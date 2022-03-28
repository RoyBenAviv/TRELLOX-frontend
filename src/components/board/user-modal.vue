!
<template>
  <custom-modal v-if="member" class="user-modal">
    <template v-slot:header> Acount </template>
    <div class="member-container">
      <div class="avatar-container" :title="member ? member.fullname : 'Guest'">
        <img v-if="member?.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ checkMember }}</span>
      </div>
      <div class="member-details">
        <h3>{{ member.fullname }}</h3>
        <h5>{{ member.email }}</h5>
      </div>
    </div>
    <hr />
    <ul class="member-options">
      <li>Activity</li>
      <li @click="logout">Log out</li>
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: 'user-modal',
  data() {
    return {}
  },
  methods: {},
  computed: {
    member() {
      return this.$store.getters.loggedinUser
    },
    checkMember() {
      return this.member ? this.member.fullname.split(' ')[0].split('')[0] + this.member.fullname.split(' ')[1].split('')[0] : 'G'
    },
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (err) {
        console.log(err)
      }
    },
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
