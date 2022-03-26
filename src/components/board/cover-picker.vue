<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Cover </template>
    <h4>Size</h4>
    <div class="cover-preview"></div>
    <button v-if="style.cover">Remove cover</button>
    <h4>Colors</h4>
    <div class="colors-container"></div>
    <h4>Attachments</h4>
    <div class="attachments-container">
        <div v-for="attachment in attachments" :key="attachment"></div>
    </div>
    <input type="file" @input="onUploadImg" />
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  props: {
    card: Object,
  },
  name: '',
  data() {
    return {
      style: {
        type: '',
        cover: '',
        fullCover: false,
      },
      attachments = JSON.parse(JSON.stringify(this.card.attachments))
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    async onUploadImg(ev) {
      const res = await imgService.uploadImg(ev)
      attachments.push(res.url)
      this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(this.attachments)))
    },
    save() {
      this.$emit('updateKey', 'style', JSON.parse(JSON.stringify(this.tyle)))
    },
  },
  computed: {},
  components: {
    customModal,
  },
}
</script>

<style></style>
