<template>
  <article class="custom-modal-container">
    <section class="custom-modal-header">
        <span>
          <slot name="header"></slot>
        </span>
        <a @click="closeModal"><i class="fa-solid fa-xmark"></i></a>
    </section>
    <section class="custom-modal-main">
      <slot name="default"></slot>
    </section>
  </article>
</template>


<script>

export default {
  created() {},
  data() {
    return {}
  },
  methods: {
    closeModal(){
      this.$emit('closeModal')
    }
  },
  computed: {},
  components: {},
  unmounted() {},
}
</script>