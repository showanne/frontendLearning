<template lang="pug">
  #product
    b-container
      b-row
        b-col(cols='12')
          h1.my-3
            font-awesome-icon(:icon='["fas","award"]').h2
            span.ml-2 私房料理
        b-col(cols='12')
          b-table(:items='products' :fields='fields' hover striped)
            template(#cell(img)='data')
              img(:src='require("../assets/"+data.value)' width="100")
              //- | {{JSON.stringify(data.value)}}
            tamplate(#cell(price)='data')
              | {{ data.value.toLocaleString("zh-tw", {style: "currency", currency: "NTD"}) }}
            template(#cell(cart)='data')
              b-btn(variant='success')
                font-awesome-icon(:icon='["fas", "shopping-cart"]')
</template>

<script>
export default {
  name: 'Product',
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
      ],
      fields: [
        { key: 'name', label: '商品', sortable: true },
        { key: 'img', label: '圖片' },
        { key: 'price', label: '商品', sortable: true },
        { key: 'cart', label: '加入購物車' }
      ]
    }
  }
}
</script>
