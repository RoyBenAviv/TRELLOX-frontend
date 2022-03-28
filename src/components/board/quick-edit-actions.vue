<template>
 <section class="quick-edit-actions-container">
         <div @click="$emit('openCard')" class="action-button">
            <span class="icon card"></span>
            <span class="txt">Open card</span>
         </div>
         <div @click="openCmp('label-picker')" class="action-button">
            <span class="icon label"></span>
            <span class="txt">Edit labels</span>
         </div>
         <div @click="openCmp('member-picker')" class="action-button">
            <span class="icon member"></span>
            <span class="txt">Change members</span>
         </div>
         <div @click="openCmp('cover-picker')" class="action-button">
            <span class="icon cover"></span>
            <span class="txt">Change cover</span>
         </div>
         <div @click="openCmp('move-place-picker')" class="action-button">
            <span class="icon move"></span>
            <span class="txt">Move</span>
         </div>
         <div @click="openCmp('copy-place-picker')" class="action-button">
            <span class="icon copy"></span>
            <span class="txt">Copy</span>
         </div>
         <div @click="openCmp('date-picker')" class="action-button">
            <span class="icon date"></span>
            <span class="txt">Edit dates</span>
         </div>
         <div @click="$emit('removeCard')" class="action-button">
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
},
computed: {
},
components: {
}
};
</script>
 
<style>
 
</style>