<template>
  <article class="custom-modal-container">
    <section class="custom-modal-header">
      <a v-if="!isFirstPage" @click.stop="goBack" class="custom-back"></a>
      <span class="title">
        <slot name="header"></slot>
      </span>
      <a @click.stop="closeModal" class="custom-close"></a>
      <!-- <a @click="closeModal" class="custom-close"><i class="fa-solid fa-xmark"></i></a> -->
    </section>
    <section class="custom-modal-main">
      <slot name="default"></slot>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    isFirstPage: {
      type: Boolean,
      default: true
    },
  },
  created() {
    // console.log('this.isFirstPage',this.isFirstPage)
  },
  data() {
    return {}
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    goBack() {
      
    this.$emit('goBack')
    },
  },
  computed: {},
  components: {},
  unmounted() {},
}
</script>
