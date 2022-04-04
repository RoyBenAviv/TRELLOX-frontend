<template>
  <custom-modal :isFirstPage="false" class="image-picker" @closeModal="closeModal">
    <template v-slot:header>Photo search</template>
    <input type="text" @input="searchImages(searchVal)" v-model="searchVal" class="custom-input" placeholder="Search Unsplash for photos" />
    <section v-if="searchVal">
        <h4>Results</h4>
        <div class="large-image-container">
            <div v-for="image in images" :key="image" class="large-preview" @click="setBgUrl(image)" :style="`background-image: url('${image}')`"></div>
        </div>
    </section>
    <section>
      <h4>Suggested searches</h4>
      <button @click="searchImages('Productivity')" class="grey-btn">Productivity</button>
      <button @click="searchImages('Perspective')" class="grey-btn">Perspective</button>
      <button @click="searchImages('Organization')" class="grey-btn">Organization</button>
      <button @click="searchImages('Colorful')" class="grey-btn">Colorful</button>
      <button @click="searchImages('Nature')" class="grey-btn">Nature</button>
      <button @click="searchImages('Business')" class="grey-btn">Business</button>
      <button @click="searchImages('Minimal')" class="grey-btn">Minimal</button>
      <button @click="searchImages('Space')" class="grey-btn">Space</button>
      <button @click="searchImages('Animals')" class="grey-btn">Animals</button>
      <h4>Top photos</h4>
      <div class="images-container">
        <div v-for="image in images" :key="image" class="attachment-preview" @click="setBgUrl(image)" :style="`background-image: url('${image}')`" :class="image === style.cover ? 'active' : ''"></div>
      </div>
      <span>Photos from <a href="https://unsplash.com/">Unsplash</a></span>
    </section>
  </custom-modal>
</template>

<script>
import { imgService } from '../../services/img.service.js'
import customModal from './custom-modal.vue'
export default {
  name: '',
  data() {
    return {
      searchVal: '',
      images: null
    }
  },
  created() {
    this.searchImages('Work', true)
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    setBgUrl(url) {
      this.$emit('setBgUrl', url)
    },
    async searchImages(searchVal, firstSearch = false) {
      if (!firstSearch) this.searchVal = searchVal
      const images = await imgService.getBgImages(searchVal)
      this.images = images.photos.results
    },
  },
  computed: {},
  components: {},
}
</script>

<style></style>
