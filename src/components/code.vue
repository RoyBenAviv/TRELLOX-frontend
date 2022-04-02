<template>
  <section>html</section>
</template>

<script>
// import appHeader from './components/app-header.vue'

export default {
  name: 'cmp name',
  //  props: {
  //    car: Object,
  //  },
  created() {},
  data() {
    return {}
  },
  methods: {
    async updateKey(key, value, activity) {
      if (key === 'checklists' || key === 'attachments') {
        value.id = utilService.makeId()
        this.card[key].push(value)
      } else this.card[key] = value
      if (activity) await this.addActivity(activity)
      await this.updateCard()
    },
  },
  computed: {},
  components: {},
  unmounted() {},
}
</script>
