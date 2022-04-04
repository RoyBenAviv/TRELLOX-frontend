<template>
   <custom-modal class="workspaces-modal">
    <template v-slot:header> Workspaces </template>
    <h4>Current Workspace</h4>
  </custom-modal>
</template>
 
<script>
 import customModal from './custom-modal.vue'
 
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
    customModal
}
};
</script>
 
<style>
 
</style>