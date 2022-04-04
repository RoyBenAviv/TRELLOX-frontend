<template>
  <BarChart :chartData="boardData" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  components: { BarChart },
  created() {
    this.loadChart()
  },
  data() {
    return {
      boardData: {
        labels: [],
        datasets: [
          {
            label: 'Tasks by lists',
            data: [],
            backgroundColor: ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563', '#b3bac5'],
            fontColor: ['white']
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
            title: {
                display: true,
                text: 'Tasks by lists',
                font: {
                    size: 28,
                    weigth: 'bold',
                    family: 'Roboto'
                }
            },
        },
        elements: {
            line: {
                backgroundColor: 'black',
                borderColor: "white",
                borderWidth: 3
            }
        },
        scales: {
        x: {
            grid: {
                display: false,
            }
        },
        y: {
            grid: {
                display: false,
            }   
        }
    }
    }
    }
  },
  methods: {
    loadChart() {
      const board = JSON.parse(JSON.stringify(this.$store.getters.currBoard))
      var groupsMap = {}
      board.groups.forEach(group => {
        groupsMap[group.title] = group.cards.length
      })
      for (const groupName in groupsMap) {
        this.boardData.labels.push(groupName)
        this.boardData.datasets[0].data.push(groupsMap[groupName])
      }
    },
  },
})
</script>
