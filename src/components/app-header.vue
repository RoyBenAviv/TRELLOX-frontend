<template>
  <header class="app-header">
    <div class="left-header">
      <div class="logo">
        <i class="fa-brands fa-trello"></i>
        <p>Trellox</p>
      </div>
      <button>Workspaces <i class="fa-solid fa-chevron-down"></i></button>
      <button>Recent <i class="fa-solid fa-chevron-down"></i></button>
      <button>Starred <i class="fa-solid fa-chevron-down"></i></button>
      <button>Templates <i class="fa-solid fa-chevron-down"></i></button>
      <button>Create</button>
    </div>
    <div class="right-header">
      <label>
        <i class="fa-solid fa-magnifying-glass"></i> 
        <input type="text" placeholder="Search" />
      </label>
        <button class="notifications"><i class="fa-solid fa-bell"></i></button>
        <div class="profile" ></div>
    </div>
  </header>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  methods: {},
  computed: {},
  components: {},
}
</script>

<style></style>
