<template>
  <span v-if="label">
    <span :style="{ backgroundColor: label.color }">0</span>
    <span v-if="label">0</span>
  </span>
</template>

<script>
export default {
  name: 'cmp name',
  props: {
    labelId: String,
  },
  created() {},
  data() {
    return {
    //   label: this.labels.find((l) => l.id === this.labelId),
    }
  },
  methods: {},
  computed: {
    labels() {
      return this.$store.getters.currBoard.labels
    },
    s(){

    }
  },
  components: {},
  unmounted() {},
}
</script>
