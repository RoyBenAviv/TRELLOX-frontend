<template>
    <section class="board-list" >
        <ul>
            <li v-for="board in boards" :key="board._id">
               <board-preview :board="board"/> 
            </li>

        </ul>

    </section>
</template>
 
<script>
    import boardPreview from './board-preview.vue' 
 
export default {


name: 'board-list',
props: {
    boards: Array
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
    boardPreview
}
};
</script>
 
<style>
 
</style>