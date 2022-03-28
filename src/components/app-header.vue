<template>
  <header class="app-header">
    <div class="left-header">
      <div @click="this.$router.push('/workspace')" class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>
      <button>Workspaces <i class="fa-solid fa-chevron-down"></i></button>
      <button>Recent <i class="fa-solid fa-chevron-down"></i></button>
      <button>Starred <i class="fa-solid fa-chevron-down"></i></button>
      <button>Templates <i class="fa-solid fa-chevron-down"></i></button>
      <button @click="openCreate = true">Create</button>
    </div>
    <div class="right-header">
      <label>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search" />
      </label>
      <button class="notifications"><i class="fa-solid fa-bell"></i></button>
      <div @click="openUser = !openUser" class="avatar-container" :title="member ? member.fullname : 'Guest'">
        <img v-if="member?.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ checkMember }}</span>
      </div>
    </div>
    <custom-modal v-if="openUser && member">
      <template v-slot:header> Acount </template>
           <div class="avatar-container" :title="member ? member.fullname : 'Guest'">
        <img v-if="member?.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ checkMember }}</span>
        <p>{{member.fullname}}</p>
      </div>
    </custom-modal>
  </header>
</template>

<script>
import CustomModal from './board/custom-modal.vue'
export default {
  name: '',
  data() {
    return {
      openCreate: false,
      openUser: false,
    }
  },
  methods: {},
  computed: {},
  components: { CustomModal },
  computed: {
    member() {
      return this.$store.getters.loggedinUser
    },
    checkMember() {
      return this.member ? this.member.fullname.split(' ')[0].split('')[0] + this.member.fullname.split(' ')[1].split('')[0] : 'G'
    },
  },
}
</script>

<style></style>
