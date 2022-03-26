<template>
  <custom-modal @closeModal="closeModal" class="cover-picker">
    <template v-slot:header> Cover </template>
    <h4>Size</h4>
    <div class="cover-preview-container">
        <div @click="setCoverSize(false)" class="cover-preview" :class="(style.fullCover) ? '' : 'active'">
            <div class="cover-top" :style="background">
                <div class="cover-bottom">
                    <div class="wide"></div>
                    <div class="narrow"></div>
                    <div class="content-container">
                        <div class="content"></div>
                        <div class="content"></div>
                    </div>
                    <div class="member"></div>
                </div>
            </div>
        </div>
        <div @click="setCoverSize(true)" class="full-cover-preview" :class="(style.fullCover) ? 'active' : '' ">
            <div class="cover-top" :style="background" >
                <div class="full-content-container" >
                    <div class="wide"></div>
                    <div class="narrow"></div>
                </div>
            </div>
        </div>
    </div>
    <button v-if="style.cover" class="custom-btn">Remove cover</button>
    <h4>Colors</h4>
    <div class="colors-container">
      <div v-for="color in colors" :key="color" class="color-preview" :style="'background-color:' + color" @click="setColor(color)" :class="color === style.cover ? 'active' : ''"></div>
    </div>
    <h4>Attachments</h4>
    <div class="attachment-container">
      <div
        v-for="attachment in attachments"
        :key="attachment"
        class="attachment-preview"
        @click="setBgUrl(attachment)"
        :style="`background-image: url('${attachment}')`"
        :class="attachment === style.cover ? 'active' : ''"
      ></div>
    </div>
    <label for="file-input" class="custom-btn">
      Upload a cover image
      <input type="file" @input="onUploadImg" class="file-input" hidden id="file-input" />
    </label>
    <span class="tip">Tip: Drag an image on to the card to upload it.</span>
    <h4 class="images-header">Photos from Unsplash</h4>
    <div class="images-container">
      <div v-for="image in images" :key="image" class="attachment-preview" @click="setBgUrl(image)" :style="`background-image: url('${image}')`" :class="image === style.cover ? 'active' : ''"></div>
    </div>
    <button class="custom-btn">Search for photos</button>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
import { imgService } from '../../services/img.service.js'
export default {
  props: {
    card: Object,
  },
  name: '',
  data() {
    return {
      style: JSON.parse(JSON.stringify(this.card.style)),
      attachments: JSON.parse(JSON.stringify(this.card.attachments)),
      colors: this.$store.getters.coverColors,
      images: this.$store.getters.coverImages,
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    async onUploadImg(ev) {
      const res = await imgService.uploadImg(ev)
      this.attachments.push(res.url)
      this.$emit('updateKey', 'attachments', this.attachments)
      this.style.cover = res.url
      this.style.type = 'url'
      this.save()
    },
    setColor(color) {
      if (this.style.cover === color) {
        this.style.cover = ''
        this.style.type = ''
      } else {
        this.style.cover = color
        this.style.type = 'color'
      }
      this.save()
    },
    setBgUrl(url) {
      this.style.cover = url
      this.style.type = 'url'
      this.save()
    },
    setCoverSize(value) {
        this.style.fullCover = value
        this.save()
    },
    save() {
      this.$emit('updateKey', 'style', JSON.parse(JSON.stringify(this.style)))
    },
  },
  computed: {
      background() {
          if(this.style.type === 'url') return `background-image:url('${this.style.cover}')`
          else return `background-color: ${this.style.cover}`
      }
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
