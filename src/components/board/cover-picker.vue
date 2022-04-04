<template>
  <custom-modal v-if="!searchPhotos" @closeModal="closeModal" class="cover-picker">
    <template v-slot:header> Cover </template>
    <h4>Size</h4>
    <div class="cover-preview-container">
      <div @click="setCoverSize(false)" class="cover-preview" :class="(!style.fullCover && style.cover) ? 'active' : ''">
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
      <div @click="setCoverSize(true)" class="full-cover-preview" :class="(style.fullCover && style.cover) ? 'active' : ''">
        <div class="cover-top" :style="background">
          <div class="full-content-container">
            <div class="wide"></div>
            <div class="narrow"></div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="style.cover" class="custom-btn" @click="removeCover">Remove cover</button>
    <section v-if="style.type === 'url' && style.fullCover && style.cover" class="text-color-container">
      <h4>Text color</h4>
      <div class="preview-container">
        <div class="dark" @click="setDark(true)" :style="`background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${style.cover}');`" :class="style.isDark ? 'active' : ''">{{card.title}}</div>
        <div class="light" @click="setDark(false)" :style="`background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('${style.cover}');`" :class="!style.isDark ? 'active' : ''">{{card.title}}</div>
      </div>
    </section>
    <h4>Colors</h4>
    <div class="colors-container">
      <div v-for="color in colors" :key="color" class="color-preview" :style="'background-color:' + color" @click="setColor(color)" :class="color === style.cover ? 'active' : ''"></div>
    </div>
    <h4>Attachments</h4>
    <div class="attachment-container">
      <div v-for="attachment in attachments" :key="attachment" class="attachment-preview" @click="setBgUrl(attachment.url)" :style="`background-image: url('${attachment.url}')`" :class="attachment.url === style.cover ? 'active' : ''"></div>
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
    <button @click="searchPhotos = true" class="custom-btn">Search for photos</button>
  </custom-modal>
  <custom-modal v-else :isFirstPage="false" @goBack="goBack" class="image-picker" @closeModal="closeModal">
    <template v-slot:header>Photo search</template>
    <input type="text" @input="searchImages(searchVal)" v-focus v-model="searchVal" class="custom-input" placeholder="Search Unsplash for photos" />
    <section v-if="searchVal">
        <h4 style="margin-top: 16px; margin-bottom: 4px;">Results</h4>
        <div class="large-image-container">
            <div v-for="photo in photos" :key="photo" class="large-preview" @click="setBgUrl(photo.urls.full)" :style="`background-image: url('${photo.urls.small}')`"></div>
        </div>
    </section>
    <section v-else>
      <h4>Suggested searches</h4>
      <div class="buttons-container">
        <button @click.stop="searchImages('Productivity')" class="grey-btn">Productivity</button>
        <button @click.stop="searchImages('Perspective')" class="grey-btn">Perspective</button>
        <button @click.stop="searchImages('Organization')" class="grey-btn">Organization</button>
        <button @click.stop="searchImages('Colorful')" class="grey-btn">Colorful</button>
        <button @click.stop="searchImages('Nature')" class="grey-btn">Nature</button>
        <button @click.stop="searchImages('Business')" class="grey-btn">Business</button>
        <button @click.stop="searchImages('Minimal')" class="grey-btn">Minimal</button>
        <button @click.stop="searchImages('Space')" class="grey-btn">Space</button>
        <button @click.stop="searchImages('Animals')" class="grey-btn">Animals</button>
      </div>
      <h4 style="margin-top: 12px; margin-bottom: 4px;">Top photos</h4>
      <div v-if="photos" class="images-container">
        <div v-for="photo in photos" :key="photo" class="attachment-preview" @click="setBgUrl(photo.urls.full)" :style="`background-image: url('${photo.urls.small}')`" :class="photo.urls.full === style.cover ? 'active' : ''"></div>
      </div>
      <span class="unsplash-txt">Photos from <a target="_blank" href="https://unsplash.com/">Unsplash</a></span>
    </section>
  </custom-modal>
</template>

<script>
import { imgService } from '../../services/img.service.js'
import customModal from './custom-modal.vue'
export default {
  props: {
    card: Object,
  },
  name: '',
  data() {
    return {
      style: JSON.parse(JSON.stringify(this.card.style)),
      colors: this.$store.getters.coverColors,
      images: this.$store.getters.coverImages,
      searchPhotos: false,
      searchVal: '',
      photos: null
    }
  },
  created() {
    this.searchImages('chill', true)
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    async onUploadImg(ev) {
      console.log('ev',ev);
      console.log('here');
      const res = await imgService.uploadImg(ev)
      const imgAttachment = {
        name: res.public_id,
        createdAt: res.created_at,
        url: res.url,
        format: res.format,
      }
      this.$emit('updateKey', 'attachments', imgAttachment, `added an attachment`)
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
      if(this.style.cover === url) {
        this.style.cover = ''
        this.style.type = ''
      } else {
        this.style.cover = url
        this.style.type = 'url'
      }
      this.goBack()
      this.save()
    },
    setCoverSize(value) {
      this.style.fullCover = value
      this.save()
    },
    save() {
      const activity = (this.style.cover) ? 'updated card cover' : 'removed card cover'
      this.$emit('updateKey', 'style', JSON.parse(JSON.stringify(this.style)), activity)
    },
    async searchImages(searchVal, firstSearch = false) {
      if (!firstSearch) this.searchVal = searchVal
      const images = await imgService.getBgImages(searchVal)
      this.photos = images.photos.results
    },
    goBack() {
      this.searchVal = ''
      this.searchPhotos = false
    },
    setDark(value) {
      this.style.isDark = value
      this.save()
    },
    removeCover() {
      this.style.cover = ''
      this.style.type = ''
      this.save()
    }
  },
  computed: {
    background() {
      if (this.style.type === 'url') return `background-image:url('${this.style.cover}')`
      else return `background-color: ${this.style.cover}`
    },
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
