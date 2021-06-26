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
          name: 'Data1',
          // 若有 data 需搭配一個 categories (分類) ，共有3種寫法本次使用 2.3 版 - https://apexcharts.com/docs/series/
          data: []
        }
      ],
      chartOptions: {
        xaxis: {
          // 若有 data 需搭配一個 categories (分類) ，共有3種寫法本次使用 2.3 版 - https://apexcharts.com/docs/series/
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
      // 若有 data 需搭配一個 categories (分類) ，共有3種寫法本次使用 2.3 版 - https://apexcharts.com/docs/series/

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
