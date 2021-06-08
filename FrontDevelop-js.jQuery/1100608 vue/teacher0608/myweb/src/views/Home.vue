<template lang="pug">
#home
  b-container
    b-row
      b-col(cols='12')
        h1.text-center 流行精品購物網
      b-col(cols='3' v-for='(product, i) in products' :key='i')
        b-card(
          img-top
          :img-src='require("../assets/" + product.img)'
          :title='product.name'
          :sub-title='product.price.toLocaleString("zh-tw", {style: "currency", currency: "NTD"})'
        )
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      products: [
        { name: '包包', img: '0403.jpg', price: 100 },
        { name: '錢包', img: '0404.jpg', price: 100 },
        { name: '鞋子', img: '0405.jpg', price: 100 },
        { name: '鞋子', img: '0406.jpg', price: 100 },
        { name: '戒指', img: '0407.jpg', price: 100 },
        { name: '包包', img: '0408.jpg', price: 100 }
      ]
    }
  }
}
</script>
