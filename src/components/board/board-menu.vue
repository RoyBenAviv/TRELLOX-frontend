<template>
  <menu class="board-menu">
    <ul>
      <li><a @click="openChangeBg = true">Change background</a></li>
    </ul>

    <div v-if="openChangeBg">
      <input type="text" v-model="search" @input="searchImages(search)" />
      <ul v-if="images">
        <li v-for="image in images" :key="image.id">
          <div @click="setBoardBg(image.urls.full)"><img :src="image.urls.small" /></div>
        </li>
      </ul>
    </div>
  </menu>
</template>

<script>
import { imgService } from '../../services/img.service.js'
export default {
  name: '',
  data() {
    return {
      openChangeBg: false,
      images: null,
      search: '',
    }
  },
  created() {
      this.searchImages('nature')
  },
  methods: {
    async searchImages(searchVal) {
      const images = await imgService.getBgImages(searchVal)
      console.log('images.photos.results', images.photos.results)
      this.images = images.photos.results
    },
    setBoardBg(boardBg) {
      this.$emit('setBoardBg', boardBg)
    },
  },
  computed: {},
  components: {
    imgService,
  },
}
</script>

<style></style>
