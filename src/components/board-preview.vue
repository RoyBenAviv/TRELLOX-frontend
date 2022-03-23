<template>
<section class="board-preview">
    <router-link :to="'/board/'+board._id">
        <img :src="board.style.bgcImgUrl" alt="" class="board-img">
        <span class="txt-on-borad-img">{{board.title}}</span>
    </router-link>
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