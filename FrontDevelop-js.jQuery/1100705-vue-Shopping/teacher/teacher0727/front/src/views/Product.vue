<template lang="pug">
b-container#product
  b-overlay(:show="!sell")
    b-row
      b-col(cols="6")
        h1 {{ name }}
      b-col(cols="6")
        h4.text-right ${{ price }}
        b-form-input(type="number" v-model.number="amount" :state="amountstate")
        b-btn(variant="primary" @click="addcart") 加入購物車
      b-col(cols="12")
        img.w-100(:src="image")
      b-col(cols="12")
        p {{ description}}
    template(#overlay)
      h1 已下架
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      name: '',
      price: '',
      description: '',
      image: '',
      sell: true,
      amount: 0
    }
  },
  computed: {
    amountstate () {
      return this.amount === 0 ? null : this.amount > 0
    }
  },
  methods: {
    async addcart () {
      if (!this.amountstate) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '請輸入正確數量'
        })
        return
      }

      if (this.$store.state.jwt.token.length === 0) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '請先登入'
        })
        return
      }

      try {
        await this.axios.post('/users/cart', { product: this.$route.params.id, amount: this.amount }, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '成功購物車'
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '加入購物車失敗'
        })
      }
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/products/' + this.$route.params.id)
      this.name = data.result.name
      this.price = data.result.price
      this.description = data.result.description
      this.image = `${process.env.VUE_APP_API}/files/${data.result.image}`
      this.sell = data.result.sell
      document.title = `${this.name} | 購物網`
    } catch (error) {
      this.$router.push('/')
    }
  }
}
</script>
