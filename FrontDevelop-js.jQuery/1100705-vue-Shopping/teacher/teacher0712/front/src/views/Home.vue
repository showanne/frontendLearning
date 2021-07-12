<template lang="pug">
b-container#home
  b-row
    b-col(cols="12" md="6" lg="4" v-for="product in products" :key="product._id")
      router-link(:to="'/product/'+product._id")
        ProductCard(:product="product")
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'Home',
  data () {
    return {
      products: []
    }
  },
  components: {
    ProductCard
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/products')
      this.products = data.result.map(product => {
        if (product.image) {
          product.image = `${process.env.VUE_APP_API}/files/${product.image}`
        }
        return product
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得商品失敗'
      })
    }
  }
}
</script>
