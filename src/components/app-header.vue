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
      <div class="avatar-container" :title="member.fullname">
        <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
        <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
      </div>
    </div>

    <!-- <custom-modal>



    </custom-modal> -->

  </header>
</template>

<script>
import CustomModal from "./board/custom-modal.vue"
export default {
  name: '',
  data() {
    return {
      openCreate: false
    }
  },
  methods: {},
  computed: {},
  components: { CustomModal },
  computed: {
    member(){
      return this.$store.getters.loggedInUser
    },
  }
}
</script>

<style></style>
