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
  data() {
    return {
    }
  },
  methods: {
    async onUploadImg(ev) {
        const res = await imgService.uploadImg(ev)
        const imgAttachment = {
          name: res.public_id,
          createdAt: res.created_at,
          url: res.url,
          format: res.format
        }
        this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(imgAttachment)))
    },
  },
  components: {
    customModal
  }
}
</script>

<style></style>
