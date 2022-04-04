<template>
  <custom-modal class="attachment-container">
    <template v-slot:header> Attach from... </template>
    <ul class="attachment-picker">
      <li>
        <label
          >Computer

          <input type="file" @change="onUploadImg" />
        </label>
      </li>
      <li @click="recording = true">
        <label> Record video </label>
      </li>
      <div v-if="recording" class="video-rec">
        <video-record class="video"  @videoUrl="videoUrl" />
      </div>
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
import { imgService } from '../../services/img.service.js'
import videoRecord from './video-record.vue'

export default {
  components: {
    customModal,
    videoRecord,
  },
  data() {
    return {
      recording: false,
    }
  },
  methods: {
    async onUploadImg(ev) {
      const res = await imgService.uploadImg(ev)
      const imgAttachment = {
        name: res.public_id,
        createdAt: res.created_at,
        url: res.url,
        format: res.format,
      }
      this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(imgAttachment)))
    },
    videoUrl(res) {
      const imgAttachment = {
        name: res.public_id,
        createdAt: res.created_at,
        url: res.url,
        format: 'mp4',
      }
      this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(imgAttachment)))
    },
  },
}
</script>

<style></style>
