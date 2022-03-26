<template>
  <custom-modal>
    <template v-slot:header> Attach from... </template>
    <ul>
      <!-- <li>Computer</li> -->
      <input type="file" @change="onUploadImg" />
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
import { imgService } from '../../services/img.service.js'
export default {
  name: '',
  props: {
    card: Object
  },
  data() {
    return {
        attachments: JSON.parse(JSON.stringify(this.card.attachments))
    }
  },
  methods: {
    async onUploadImg(ev) {
        const res = await imgService.uploadImg(ev)
        this.attachments.push(res.url)
        this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(this.attachments)))
    },
  },
  components: {
    customModal
  }
}
</script>

<style></style>
