<template>
  <main class="home-wrapper">
    <home-header />
    <div class="home-view main-layout">
      <div class="topside">
        <article>
          <h1>Trellox helps teams move work forward.</h1>
          <p>Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique accomplish it all with Trellox.</p>
          <button @click="toWorkSpace">
            Start demo <span><i class="fa-solid fa-arrow-right"></i></span>
          </button>
        </article>
        <div class="background"></div>
      </div>
      <div class="middle">
        <h1>It’s more than work. It’s a way of working together.</h1>
        <p>
          It’s more than work. It’s a way of working together. Start with a Trellox board, lists, and cards. Customize and expand with more features as your teamwork grows. Manage projects, organize tasks, and build team spirit—all in one
          place.
        </p>
        <img src="https://res.cloudinary.com/trellox/image/upload/v1648555830/board_esjncu.png" />
      </div>
    </div>
  </main>
</template>

<script>
import homeHeader from '../components/home/home-header.vue'

export default {
  name: 'home',
  data() {
    return {
      companyUrls: ['src/assets/images/google-logo.jpg', 'src/assets/images/microsoft-logo.png', 'src/assets/images/meta-logo.jpg']
    }
  },
  methods: {
    toWorkSpace() {
      this.$router.push(`/workspace`)
    },
  },
  computed: {},
  components: {
    homeHeader,
  },
}
</script>

<style></style>
