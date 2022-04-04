<template>
  <custom-modal @closeModal="closeModal" class="share-card">
    <template v-slot:header>Share and more...</template>
    <h4>Link to this card <span class="members-icon"></span></h4>
    <input type="text" v-focus autofocus v-model="cardLink" style="resize: none" class="custom-input">
    <div class="share-btn-container">
      <a class="facebook" :href="`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ftrelloxx.herokuapp.com%2F%23%2Fboard%2F${this.$route.params.boardId}%2Fedit%2F${card.id}`" target="_blank"><i class="fab fa-facebook-f "></i>Facebook</a>
      <a class="whatsapp" :href="`whatsapp://send?text=https%3A%2F%2Ftrelloxx.herokuapp.com%2F%23%2Fboard%2F${this.$route.params.boardId}%2Fedit%2F${card.id}`" target="_blank" data-action="share/whatsapp/share"><i class="fa fa-whatsapp " aria-hidden="true"></i>Whatsapp</a>
    </div>
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

</style>
