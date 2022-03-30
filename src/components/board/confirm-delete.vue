<template>
 <custom-modal @closeModal="closeModal">
    <template v-slot:header> Delete card? </template>
    <p style="margin: 0 0 8px;">
        All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.
    </p>
    <button class="delete-btn" style="width: 100%; justify-content: center;" @click="removeCard">Delete</button>
 </custom-modal>
</template>
 
<script>
import customModal from './custom-modal.vue'
export default {
 
 data() {
return {
 
};
 },
methods: {
    removeCard() {
        this.$emit('removeCard')
    },
    closeModal() {
      this.$emit('closeModal')
    },
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