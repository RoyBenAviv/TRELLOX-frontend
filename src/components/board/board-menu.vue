<template>
  <custom-modal :isFirstPage="isFirstPage" @goBack="goBack" class="board-menu" @closeModal="closeModal">
    <template v-slot:header> <p class="header-title">Menu</p> </template>
    <menu v-if="!openChangeBg && !openChangeImg && !openChangeColor && !openStickers">
      <ul class="menu-options">
        <li class="stickers" @click="openStickers = true"><a>Stickers</a></li>
        <li class="change-bg-btn" @click="openChangeBg = true"><i class="fa-solid fa-image"></i> <a>Change background</a></li>
      </ul>
      <hr />
      <ul class="menu-options">
        <li><i class="fa-solid fa-list-ul"></i> <a class="activity">Activity</a></li>
      </ul>
      <div class="activities-container" v-if="activities.length">
        <div class="card-comment-container" v-for="activity in activities.splice(0,20)" :key="activity.id">
          <div class="avatar-container member">
            <img v-if="activity.byMember.imgUrl" :src="activity.byMember.imgUrl" alt="" />
            <span v-else>{{ activity.byMember._id ? activity.byMember.fullname.split(' ')[0].split('')[0] + activity.byMember.fullname.split(' ')[1].split('')[0] : 'G' }}</span>
          </div>
          <div class="card-comment activities">
            <div>
              <span class="comment-by">{{ activity.byMember.fullname }}</span>
              <span class="activity-txt"> {{ activity.txt }}</span>
            </div>
            <span class="comment-date">{{ formattedTime(activity.createdAt) }}</span>
          </div>
        </div>
      </div>
    </menu>
    <Transition name="inside-menu">
      <div class="bg-choose" v-if="openChangeBg && !openChangeImg && !openChangeColor && !openStickers">
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
        <div class="bg-picker">
          <div class="custom-bg">
            <label>
              <i class="fa-solid fa-plus"></i>
              <input type="file" @change="onUploadImg" />
            </label>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="inside-menu">
        <div class="choose-sticker" v-if="openStickers">
              <input class="custom-input" placeholder="Search sticker" type="text" v-model="stickerSearch" @input="searchStickers(stickerSearch)" />
              <Container class="stickers-list" v-if="stickers" group-name="5" :get-child-payload="getChildPayload">
                <Draggable @mousedown="this.$store.commit({ type: 'stickerDrag', isDrag: true })" v-for="sticker in stickers" :key="sticker.id">
                    <img :src="sticker.images.original_still.url" :alt="sticker.title"/>
                </Draggable>
              </Container>
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
    <Transition name="inside-menu">
      <div class="bg-choose-color" v-if="openChangeColor">
        <ul class="bg-colors" v-if="images">
          <li v-for="color in colors" :key="color">
            <div @click="setBoardClr(color)" class="bg-color" :style="{ 'background-color': color.body }"></div>
          </li>
        </ul>
      </div>
    </Transition>
  </custom-modal>
</template>

<script>
import { imgService } from '../../services/img.service.js'
import customModal from './custom-modal.vue'
import { utilService } from '../../services/util.service.js'
import { Container, Draggable } from 'vue3-smooth-dnd'

export default {
  name: 'board-menu',
  data() {
    return {
      openChangeBg: false,
      images: null,
      stickers: null,
      colors: this.$store.getters.boardColors,
      search: '',
      stickerSearch: '',
      openChangeImg: false,
      openChangeColor: false,
      openStickers: false
    }
  },
  created() {
    this.searchImages('nature')
    this.searchStickers('Lets go')
  },
  methods: {
    async searchImages(searchVal) {
      const images = await imgService.getBgImages(searchVal)
      this.images = images.photos.results.splice(0, 10)
    },
    async searchStickers(searchVal) {
      const stickers = await imgService.getStickers(searchVal)
      this.stickers = stickers.data
    },
    async onUploadImg(ev) {
      const res = await imgService.uploadImg(ev)

      this.$emit('setBoardBg', res.url)
    },
    setBoardBg(boardBg) {
      this.$emit('setBoardBg', boardBg)
    },
    setBoardClr(boardClr) {
      this.$emit('setBoardClr', boardClr)
    },
    closeModal() {
      this.$emit('closeMenu')
    },
    goBack() {
      if (this.openChangeImg || this.openChangeColor || this.openStickers) {
        this.openChangeImg = false
        this.openChangeColor = false
        this.openStickers = false
      } else this.openChangeBg = false
    },
    formattedTime(activityTime) {
      return utilService.getFormattedTime(activityTime)
    },
    getChildPayload(idx) {
      return this.stickers[idx]
    },
  },
  computed: {
    isFirstPage() {
      return this.openChangeBg || this.openChangeImg || this.openChangeColor || this.openStickers ? false : true
    },
    activities() {
      return this.$store.getters.currBoard.activities || []
    },

  },

  components: {
    imgService,
    customModal,
    Container,
    Draggable
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
