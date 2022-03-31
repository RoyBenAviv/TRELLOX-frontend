<template>
  <header id="header" class="home-header">
    <div class="logo"><span><i class="fa-brands fa-trello"></i></span> <h2>Trellox</h2></div>
      <nav>
        <div class="guest-nav" v-if="!member">
        <router-link to="/login">Log in</router-link>
        <router-link to="/signup">Sign up</router-link>
        </div>
        <div class="member-nav" v-else>
          <a @click="this.$router.push('/workspace')">Welcome {{member.fullname.split(' ')[0]}}</a>
        </div>
      </nav>
  </header>
</template>

<script>
export default {
  name: 'app header',
  data() {
    return {}
  },
  methods: {
      async logout() {
        try {
        await this.$store.dispatch('logout')
      } catch (err) {
        console.log(err)
      }
    },
  },
  created() {
    window.onscroll = function() {
      var header = document.getElementById('header')
      if (window.scrollY > 10) {
      header.style.backgroundColor = 'white'
      header.style.boxShadow = '0px 3px 3px 0px rgba(0,0,0,0.3)'
      }

      else {
        header.style.backgroundColor = ''
        header.style.boxShadow = ''
      }
    }
  },
  computed: {
    member() {
      return this.$store.getters.loggedinUser
    },
  },
  components: {},
}
</script>

<style></style>
