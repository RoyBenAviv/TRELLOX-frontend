<template>
  <section>html</section>
</template>

<script>

export default {
  name: 'cmp name',
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
