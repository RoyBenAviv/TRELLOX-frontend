!
<template>
  <custom-modal v-if="member" class="user-modal">
    <template v-slot:header> Account </template>
    <template v-slot:main>
      <div v-if="!openActivity">
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
          <li @click.stop="openActivity = true">Activity</li>
          <li @click="logout">Log out</li>
        </ul>
      </div>
      <div v-else>
        <p v-if="!memberActivity?.length || !memberActivity">
            No activities to display.
        </p>
        <ul v-else>
            <li v-for="activity in memberActivity" :key="activity.id">
                <p>You {{activity.txt}}.</p>
                <p>At {{activity.createdAt}}</p>
            </li>
        </ul>
          
        </div>
    </template>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: 'user-modal',
  data() {
    return {
      openActivity: false,
    }
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
      this.$emit('logout')
    },
    memberActivity() {
      return this.$store.getters.currBoard?.activities.filter(activity => {
        activity.byMember._id === this.$store.getters.loggedinUser._id
      })
    }
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
