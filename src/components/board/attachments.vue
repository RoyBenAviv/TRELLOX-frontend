<template>
  <custom-modal class="attachment-container">
    <template v-slot:header> Attach from... </template>
    <ul class="attachment-picker">
      <li><label>Computer

        <input type="file" @change="onUploadImg" />
      </label></li>
            <li><label>Google Drive
      </label></li>
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
        console.log('res',res);
        const imgAttachment = {
          name: res.public_id,
          createdAt: res.created_at,
          url: res.url,
          format: res.format
        }
        this.attachments.push(imgAttachment)
        this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(this.attachments)), `added an attachment`)
    },
  },
  components: {
    customModal
  }
}
</script>

<style></style>
