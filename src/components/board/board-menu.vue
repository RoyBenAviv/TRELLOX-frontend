<template>
  <custom-modal class="board-menu" @closeModal="closeModal">
    <template v-slot:header> <p class="header-title">Menu</p> </template>
    <menu v-if="!openChangeBg && !openChangeImg && !openChangeColor">
      <ul class="menu-options">
        <li><i class="fa-brands fa-trello"></i> <a>About this board</a></li>
        <li @click="openChangeBg = true"><i class="fa-solid fa-image"></i> <a>Change background</a></li>
      </ul>
      <hr />
      <ul class="menu-options">
        <li><i class="fa-solid fa-list-ul"></i> <a class="activity">Activity</a></li>
      </ul>
    </menu>
    <Transition name="inside-menu">
      <div class="bg-choose" v-if="openChangeBg && !openChangeImg">
        <div class="bg-choose-top">
          <div @click="openChangeImg = true" class="bg-picker">
            <img src="https://res.cloudinary.com/trellox/image/upload/v1648369955/background_ffsmh3.jpg" alt="background image picker" />
            <p>Photos</p>
          </div>
          <div @click="openChangeColor = true" class="bg-picker">
            <img src="https://res.cloudinary.com/trellox/image/upload/v1648369959/colors_ucac3l.jpg" alt="color picker" />
            <p>Colors</p>
          </div>
        </div>
        <hr />
        <h2>Custom</h2>
        <div class="bg-picker"></div>
      </div>
    </Transition>

    <Transition name="inside-menu">
      <div class="bg-choose-img" v-if="openChangeImg">
        <input class="custom-input" placeholder="Photos" type="text" v-model="search" @input="searchImages(search)" />
        <ul class="bg-images" v-if="images">
          <li v-for="image in images" :key="image.id">
            <div @click="setBoardBg(image.urls.full)"><img :src="image.urls.small" /></div>
          </li>
        </ul>
      </div>
    </Transition>
    <Transition name="inside menu">
      <div class="bg-choose-color" v-if="openChangeColor">
          <h1>TEST</h1>
      </div>
    </Transition>
  </custom-modal>
</template>

<script>
import { imgService } from '../../services/img.service.js'
import customModal from './custom-modal.vue'

export default {
  name: '',
  data() {
    return {
      openChangeBg: false,
      images: null,
      search: '',
      openChangeImg: false,
      openChangeColor: false
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
    closeModal() {
      this.$emit('closeMenu')
    },
  },
  computed: {},
  components: {
    imgService,
    customModal,
  },
}
</script>

<style scoped>
.inside-menu-enter-active {
  transition: transform 0.3s ease-out;
}
.inside-menu-enter-from,
.inside-menu-leave-to {
  transform: translateX(450px);
}
</style>
