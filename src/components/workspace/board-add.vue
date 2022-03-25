<template>
  <custom-modal class="board-add"  @closeModal="closeModal">
    <template v-slot:header> Create board </template>
    <div class="demo-board" >
            <img src="src/assets//images/demo-board.svg" alt="demo board"/>
    </div>
    <div class="background-picker">
        <h4>Background</h4>
        <ul class="image-picker">
            <li><img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwyfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=80&w=400" alt=""></li>
            <li><img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwyfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=80&w=400" alt=""></li>
            <li><img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwyfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=80&w=400" alt=""></li>
            <li><img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwyfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=80&w=400" alt=""></li>
        </ul>
        <ul class="color-picker">
            <li>
                <div></div>
            </li>
        </ul>
        <h4>Board title <span>*</span></h4>
        <input type="text" placeholder="Add board title">
        <button>Create</button>
    </div>
  </custom-modal>
</template>
 
<script>
 import customModal from '../board/custom-modal.vue'

export default {
 
name: '',
 data() {
return {
 
};
 },
methods: {
    closeModal() {
        this.$emit('closeModal')
    }
},
computed: {
},
components: {
    customModal
}
};
</script>
 
<style>
 
</style>