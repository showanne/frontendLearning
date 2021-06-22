<template>
  <div class="home">
    <div id="chart">
      <apexchart type="bar" width="550" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      series: [
        {
          name: 'Datal',
          data: []
        }
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        }
      }
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('http://localhost:3000/products')
      console.log(data)
      this.series[0].data = data.result.map(item => {
        return { y: item.price, x: item.name }
      })

        // this.series[0].data = data.result.map(item => item.price)
        // this.chartOptions.xaxis.categories = data.result.map(item => item.name)
      // console.log(data.result.map(item => item.price))
      // console.log(data.result.map(item => item.name))
    } catch (error) {
      alert(error)
    }
  }
}
</script>
