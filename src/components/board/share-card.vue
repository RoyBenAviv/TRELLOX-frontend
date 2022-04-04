<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header>Share and more...</template>
    <h4>Link to this card <span class="members-icon"></span></h4>
    <input type="text" v-focus autofocus v-model="cardLink" style="resize: none" class="custom-input">
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  props: {
    card: Object
  },
  data() {
    return {
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
  },
  computed: {
      cardLink() {
          return `https://trelloxx.herokuapp.com/#/board/${this.$route.params.boardId}/edit/${this.card.id}`
      }
  },
  components: {
    customModal,
  },
}
</script>

<style>
.members-icon {
    color: #f2d600;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    font-family: trellicons;
    transform: translateY(2px);
}
.members-icon::before {
    content: "\e951";
}
</style>
