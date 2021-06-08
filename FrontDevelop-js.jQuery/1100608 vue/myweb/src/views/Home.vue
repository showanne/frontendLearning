<template lang="pug">
  #home
    b-container
      b-row
        b-col(cols='12')
          h1.text-center 私房料理
        b-col(cols='3' v-for='(product, i) in products' :key='i')
          b-card(
                  img-top
                  :img-src='require("../assets/" + product.img)'
                  :title='product.name'
                  :sub-title='product.price.toLocaleString("zh-tw", {style: "currency", currency: "NTD"})'
                )
                  //- .toLocaleString("zh-tw", {style: "currency", currency: "NTD"}) 數字 金額格式化
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      products: [
        { name: '菜', img: 'egg1.jpg', price: 50 },
        { name: '蛋', img: 'egg2.jpg', price: 150 },
        { name: '菜', img: 'egg1.jpg', price: 250 },
        { name: '菜', img: 'egg2.jpg', price: 500 },
        { name: '菜', img: 'egg1.jpg', price: 100 },
        { name: '菜', img: 'egg2.jpg', price: 90 },
        { name: '菜', img: 'egg1.jpg', price: 250 }
      ]
    }
  }
}
</script>
