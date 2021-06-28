<template>
  <div class="home">
    <apexchart width="500" type="bar" :options="options" :series="series" />
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      series: [
        { name: 'Data1', data: [] }
      ],
      options: {
        xaxis: {
          categories: []
        }
      }
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('http://localhost:3000/products')
      this.series[0].data = data.result.map(item => {
        return { y: item.price, x: item.name }
      })
    } catch (error) {
      alert('錯誤')
    }
  }
}
</script>
