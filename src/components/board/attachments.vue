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
  data() {
    return {
        attachments: []
    }
  },
  methods: {
    async onUploadImg(ev) {
        const res = await imgService.uploadImg(ev)
        this.attachments.push(res.url)
        console.log('res.url',res.url);
        console.log('attachments',this.attachments);
        this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(this.attachments)))
    },
  },
  components: {
    customModal
  }
}
</script>

<style></style>
