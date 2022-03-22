<template>
  <section>
      <h2>{{list.title}}</h2>
      <button @click="addList"></button>
      <div v-for="card in list.cards" :key="card.id">
          <card-preview :card="card"></card-preview>
      </div>
  </section>
</template>

<script>
import cardPreview from './card-preview.vue'

export default {
  name: 'list',
  props: {
    list: Object,
  },
  components: {
      cardPreview
  },
  created() {},
  data() {
    return {}
  },
  methods: {
    addList() {
      
    }
  },
  computed: {},
  unmounted() {},
}
</script>
