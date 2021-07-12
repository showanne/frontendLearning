<template lang="pug">
  b-container#cart
    b-row
      b-col(cols="10")
        h1.text-center 總金額 {{ totalprice }}
        //- ref="table" 對應 this.$refs.table.refresh()
      b-col(cols="2")
        b-btn(variant="primary" @click="checkout").m-2 結帳
      b-col(cols="12")
        b-table(:items="cart" :fields="fields" ref="table")
          template(#cell(image)="data")
            img(v-if="data.item" :src="data.item.image" style="height: 50px")
          template(#cell(amount)="data")
            span(v-if="!data.item.edit") {{ data.item.amount }}
            b-form-input(v-else type="number" v-model.number="data.item.amountModel" :state="data.item.amountModel > 0")
          template(#cell(action)="data")
            b-btn(
              variant="outline-success"
              squared size="sm"
              @click="editProduct(data.index)"
              v-if="!data.item.edit"
            ) 編輯
            b-btn(
              variant="danger"
              squared size="sm"
              @click="delProduct(data.index)"
              v-if="!data.item.edit"
            ).ml-2 刪除
            b-btn(
              variant="success"
              squared size="sm"
              @click="submitProduct(data. index)"
              v-if="data.item.edit"
            ) 確定
            b-btn(
              variant="danger"
              squared size="sm"
              @click="cancelProduct(data.index)"
              v-if="data.item.edit"
            ).ml-2 取消
</template>

<script>
export default {
  name: 'Cart',
  data () {
    return {
      cart: [],
      fields: [
        { key: 'image', label: '圖片' },
        { key: 'name', label: '品名' },
        { key: 'amount', label: '數量' },
        { key: 'price', label: '價格' },
        { key: 'action', label: '操作' }
      ]
    }
  },
  computed: {
    totalprice () {
      // .reduce 累加
      // accumulator 目前總值
      // currentValue 要累加的值
      // , 0 初始值
      return this.cart.length === 0 ? 0 : this.cart.reduce((accumulator, currentValue) => accumulator + (currentValue.amount * currentValue.price), 0)
    }
  },
  methods: {
    editProduct (index) {
      this.cart[index].edit = true
    },
    async delProduct (index) {
      try {
        await this.axios.patch('/users/cart', { product: this.cart[index]._id, amount: 0 }, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.cart.splice(index, 1)
        this.$refs.table.refresh()
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '刪除商品失敗'
        })
      }
    },
    async submitProduct (index) {
      try {
        await this.axios.patch('/users/cart', { product: this.cart[index]._id, amount: this.cart[index].amountModel }, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.cart[index].amount = this.cart[index].amountModel
        this.cart[index].edit = false
        this.$refs.table.refresh()
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '修改商品失敗'
        })
      }
    },
    cancelProduct (index) {
      this.cart[index].edit = false
      this.cart[index].amountModel = this.cart[index].amount
    },
    async checkout () {
      try {
        await this.axios.post('/users/checkout', {}, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$swal({
          icon: 'success',
          title: '結帳成功',
          text: '請耐心等待出貨唷 ^^'
        })
        this.$router.push('/orders')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '結帳失敗'
        })
      }
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/users/cart', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.cart = data.result.map(item => {
        // ... 其餘運算子 把回傳的資料(json)攤平
        // A:"aa",B: {C:"cc", D:"dd"} -> A:"aa",C:"cc", D:"dd"
        item = { ...item.product, amount: item.amount }
        item.image = `${process.env.VUE_APP_API}/files/${item.image}`
        item.edit = false
        item.amountModel = item.amount
        return item
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得購物車失敗'
      })
    }
  }
}
</script>
