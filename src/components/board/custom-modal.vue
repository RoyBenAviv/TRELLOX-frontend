<template>
  <article class="custom-modal-container">
    <section class="custom-modal-header">
      <a v-if="!isFirstPage" @click.stop="goBack" class="custom-back"></a>
      <span class="title">
        <slot name="header"></slot>
      </span>
      <a @click.stop="closeModal" class="custom-close"></a>
    </section>
    <section class="custom-modal-main">
      <slot name="default"></slot>
    </section>
        <section class="custom-modal-app-header">
      <slot name="main"></slot>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    isFirstPage: {
      type: Boolean,
      default: true,
    },
  },
  created() {},
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
  emits: ['closeModal', 'goBack'],
}
</script>
