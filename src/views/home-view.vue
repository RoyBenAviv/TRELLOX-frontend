<template>
  <home-header />
  <main class="home-view main-layout">
    
    <article>
      <h1>Trellox helps teams move work forward.</h1>
      <p>Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all with Trello.</p>
      <button @click="toWorkSpace">Start now >></button>
    </article>
    <img src="https://res.cloudinary.com/trellox/image/upload/v1648060642/cooperation_rdrrnf.png" />

  </main>
</template>
 
<script>
import homeHeader from '../components/home/home-header.vue'
 
export default {

name: 'home',
 data() {
return {
 
};
 },
methods: {
  toWorkSpace() {
    this.$router.push(`/workspace`)
  }
},
computed: {
},
components: {
  homeHeader
}
};
</script>
 
<style>
 
</style>


