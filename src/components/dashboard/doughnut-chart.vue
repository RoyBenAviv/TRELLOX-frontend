<template>
  <DoughnutChart :chartData="boardData" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  components: { DoughnutChart },
  created() {
    this.loadChart()
  },
  data() {
    return {
      boardData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563', '#b3bac5'],
            fontColor: ['white']
          },
        ],
      },
      options: {
        plugins: {
            title: {
                display: true,
                text: 'Tasks by labels',
                font: {
                    size: 28,
                    weigth: 'bold',
                    family: 'Roboto'
                }
            },
            legend: {
                position: false
            }
        }
    }
    }
  },
  methods: {
    loadChart() {
    Chart.defaults.color = "#ffff";
      const board = JSON.parse(JSON.stringify(this.$store.getters.currBoard))
      const labels = board.labels
      const boardData = JSON.parse(JSON.stringify(this.boardData))
      var labelIdsMap = {}
      board.groups.forEach((group) => {
        group.cards.forEach((card) => {
          if (card.labelIds.length) {
            card.labelIds.forEach((labelId) => {
              labelIdsMap[labelId] ? labelIdsMap[labelId]++ : (labelIdsMap[labelId] = 1)
            })
          }
        })
      })
      for (const labelId in labelIdsMap) {
        const labelDetails = labels.find((label) => label.id === labelId)
        if (labelDetails) {
          boardData.labels.push(labelDetails.title)
          boardData.datasets[0].data.push(labelIdsMap[labelId])
        }
      }
      this.boardData = boardData
    },
  },
})
</script>
