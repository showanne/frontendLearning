<template lang="pug">
#product
  b-container
    b-row
      b-col(cols='12')
        h1 商品
      b-col(cols='12')
        b-table(:items='products' :fields='fields' hover striped)
          template(#cell(img)='data')
            img(:src='require("../assets/"+data.value)' width="100")
          template(#cell(price)='data')
            | {{ data.value.toLocaleString("zh-tw", {style: "currency", currency: "NTD"}) }}
          template(#cell(cart)='data')
            b-btn(variant='primary')
              font-awesome-icon(:icon='["fas", "shopping-cart"]')
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      products: [
        { name: '包包', img: '0403.jpg', price: 100 },
        { name: '錢包', img: '0404.jpg', price: 100 },
        { name: '鞋子', img: '0405.jpg', price: 100 },
        { name: '鞋子', img: '0406.jpg', price: 100 },
        { name: '戒指', img: '0407.jpg', price: 100 },
        { name: '包包', img: '0408.jpg', price: 100 }
      ],
      fields: [
        { key: 'name', label: '商品', sortable: true },
        { key: 'img', label: '圖片' },
        { key: 'price', label: '價格', sortable: true },
        { key: 'cart', label: '購物車' }
      ]
    }
  }
}
</script>
