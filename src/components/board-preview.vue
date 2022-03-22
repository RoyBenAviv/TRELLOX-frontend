<template>
<section class="board-preview">
    <router-link :to="'/board/'+board._id"><pre>{{board}}</pre></router-link>
</section>
</template>
 
<script>
 
export default {


name: 'board-preview',
props: {
    board: Object,
  },

 data() {
return {
 
};
 },
methods: {
},
computed: {
},
components: {
}
};
</script>
 
<style>
 
</style>