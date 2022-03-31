<template>
 <section class="quick-edit-actions-container">
         <div @click="$emit('openCard')" class="action-button">
            <span class="icon card"></span>
            <span class="txt">Open card</span>
         </div>
         <div @click="openModal('label-picker')" class="action-button">
            <span class="icon label"></span>
            <span class="txt">Edit labels</span>
         </div>
         <div @click="openModal('member-picker')" class="action-button">
            <span class="icon member"></span>
            <span class="txt">Change members</span>
         </div>
         <div @click="openModal('cover-picker')" class="action-button">
            <span class="icon cover"></span>
            <span class="txt">Change cover</span>
         </div>
         <div @click="openModal('move-card')" class="action-button">
            <span class="icon move"></span>
            <span class="txt">Move</span>
         </div>
         <div @click="openModal('copy-card')" class="action-button">
            <span class="icon copy"></span>
            <span class="txt">Copy</span>
         </div>
         <div @click="openModal('date-picker')" class="action-button">
            <span class="icon date"></span>
            <span class="txt">Edit dates</span>
         </div>
         <div @click="openModal('confirm-delete')" class="action-button">
            <span class="icon remove"></span>
            <span class="txt">Delete</span>
         </div>
 </section>
</template>
 
<script>
 
export default {
 
name: '',
 data() {
return {
 
};
 },
methods: {
    openModal(cmpName) {
        this.$emit('openModal', cmpName)
    }
},
computed: {
},
components: {
}
};
</script>
 
<style>
 
</style>