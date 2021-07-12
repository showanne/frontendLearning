<template lang="pug">
b-container#orders
  b-table(:items="orders" :fields="fields")
    template(#cell(products)="data")
      ul
        li(v-for="product in data.item.products") {{ product.product.name}} * {{ product.amount}}
</template>

<script>
export default {
  name: 'Orders',
  data () {
    return {
      orders: [],
      fields: [
        {
          key: '_id',
          label: '訂單編號'
        },
        {
          key: 'date',
          label: '日期'
        },
        {
          key: 'products',
          label: '商品'
        }
      ]
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/users/orders', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.orders = data.result.orders.map(order => {
        order.date = new Date(order.date).toLocaleString()
        return order
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得訂單失敗'
      })
    }
  }
}
</script>
