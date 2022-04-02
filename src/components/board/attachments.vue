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
      <!-- <li>
        <label> Google Drive </label>
      </li> -->
      <li @click="recording = true">
        <label> record video </label>
      </li>
      <div v-if="recording" class="video-rec">
        <video-record class="video"  @videoUrl="videoUrl" />
      </div>

      <!-- <audio-recorder
    :attempts="3"
    :time="2"
    :headers="headers"
    :before-recording="callback"
    :pause-recording="callback"
    :after-recording="callback"
    :select-record="callback"
    :before-upload="callback"
    :successful-upload="callback"
    :failed-upload="callback"/> -->
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
      console.log('imgAttachment.format',imgAttachment.format)
      this.$emit('updateKey', 'attachments', JSON.parse(JSON.stringify(imgAttachment)))
    },
    // callback(data) {
    //   console.log(data)
    // }
  },
}
</script>

<style></style>
