<template lang="pug">
#adminorders
  h1.text-center 訂單管理
  b-table(:items="orders" :fields="fields")
    template(#cell(account)="data")
      | {{ data.item.user.account }}
    template(#cell(products)="data")
      ul
        li(v-for="product in data.item.products") {{ product.product.name}} * {{ product.amount}}
</template>

<script>
export default {
  name: 'AdminOrders',
  data () {
    return {
      orders: [],
      fields: [
        {
          key: 'account',
          label: '使用者'
        },
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
      const { data } = await this.axios.get('/users/orders/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.orders = data.result.map(order => {
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
