<template lang="pug">
b-container#product
  //- 如果商品非上架狀態，顯示 overlay
  b-overlay(
    :show="!sell"
  )
    b-row
      b-col(cols="6")
        img.w-75.m-auto(:src="image")
      b-col(cols="6")
        h1.mt-3 {{ name }}
        h4.text-right ${{ price }}
        b-form(inline).mt-5
          b-row
            b-col(cols="12" md="7")
              b-form-input(type="number" v-model.number="amount" :state="amountstate")
            b-col(cols="12" md="5")
              b-btn(variant="primary" @click="addcart").mt-3.mt-md-0 加入購物車
      b-col(cols="12")
        p.mt-5 {{ description}}
    template(#overlay)
      svg(xmlns='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink' style='margin:auto;background:transparent;display:block;' width='200px' height='200px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid')
        defs
          clipPath#ldio-tbwc0l1v65-cp
            rect(x='0' y='0' width='100' height='82.235')
        path(stroke='#dcdcdc' stroke-width='1' fill='#dcdcdc' d='M85.529 75.177H14.471c-2.469 0-4.471 2.002-4.471 4.471h80C90 77.179 87.998 75.177 85.529 75.177z')
        g(clip-path='url(#ldio-tbwc0l1v65-cp)')
          g
            animateTransform(attributeName='transform' type='translate' repeatCount='indefinite' dur='1s' values='0 0;0 150' keyTimes='0;1')
            g(transform='translate(0 -75)')
              path(fill='#ffb856' d='M50 25c-13.785 0-25 11.215-25 25s11.215 25 25 25s25-11.216 25-25S63.784 25 50 25z M50 70.845 c-11.494 0-20.844-9.351-20.844-20.845S38.506 29.155 50 29.155S70.845 38.506 70.845 50S61.493 70.845 50 70.845z')
              path(fill='#ffd55d' d='M50 29.155c-11.494 0-20.844 9.351-20.844 20.844S38.506 70.845 50 70.845S70.845 61.493 70.845 50S61.493 29.155 50 29.155 z')
              path(fill='#ffff34' d='M48.11 62.796v-1.64c-1.535-0.068-3.041-0.358-4.281-0.765c-1.029-0.337-1.611-1.421-1.342-2.469 l0.043-0.167c0.297-1.158 1.521-1.781 2.653-1.395c1.152 0.392 2.465 0.662 3.855 0.662c2.032 0 3.421-0.783 3.421-2.21 c0-1.354-1.14-2.21-3.778-3.101c-3.814-1.283-6.416-3.066-6.416-6.523c0-3.137 2.211-5.596 6.025-6.345v-1.639 c0-0.965 0.782-1.746 1.746-1.746h0c0.965 0 1.746 0.782 1.746 1.746v1.39c1.275 0.057 2.327 0.226 3.21 0.459 c1.107 0.291 1.782 1.404 1.498 2.513v0c-0.287 1.118-1.44 1.803-2.546 1.473c-0.843-0.251-1.887-0.453-3.16-0.453 c-2.317 0-3.066 0.998-3.066 1.997c0 1.176 1.247 1.924 4.277 3.065c4.241 1.498 5.953 3.458 5.953 6.666 c0 3.173-2.246 5.882-6.345 6.594v1.89c0 0.965-0.782 1.746-1.746 1.746h-0.001C48.892 64.543 48.11 63.761 48.11 62.796z')
        path(stroke='#dcdcdc' stroke-width='1' fill='#dcdcdc' d='M14.471 84.823h71.058c2.469 0 4.471-2.002 4.471-4.471v-0.704H10v0.704C10 82.821 12.002 84.823 14.471 84.823z')
      h1.text-center 已下架
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
      // this.amount = ''
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
        this.$router.push('/cart')
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
      // 將網頁名稱改為商品名稱
      document.title = `${this.name} | 商品 | 購物網`
    } catch (error) {
      // console.log(error)
      this.$router.push('/')
    }
  }
}
</script>
