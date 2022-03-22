<template>
  <section>
      <p @click="openActionsMenu = !openActionsMenu">{{card.title}}</p>
      <card-actions v-if="openActionsMenu"></card-actions>
  </section>
</template>

<script>
import cardActions from './card-actions.vue'
export default {
  name: 'card-preview',
  props: {
    card: Object,
  },
  components: {
    cardActions
  },
  created() {},
  data() {
    return {
      openActionsMenu: false,
    }
  },
  methods: {},
  computed: {},
  unmounted() {},
}
</script>
