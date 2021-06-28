<template>
  <div class="about">
    <h1>輸入</h1>
      <form action="" @submit.prevent="send" style="text-align:left;">
        品名：<input type="text" v-model="form.name" style="width:147px;"> <br>
        描述：<input type="text" v-model="form.description" style="width:147px;"> <br>
        價格：<input type="number" v-model="form.price" min="0" style="width:147px;"> <br>
        時間：<input type="date" v-model="form.date" style="width:150px;margin-top:3px;"> <br>
        <input type="submit" value="送出" style="margin:10px 35px;">
        <input type="reset" value="重設" style="margin:10px 0;">
      </form>
    <h1>商品資料呈現</h1>
    <table>
      <tr>
        <th>品名</th>
        <th>描述</th>
        <th>價格</th>
        <th>時間</th>
      </tr>
      <tr v-for="(p, i) in products" :key="p._id">
        <td>{{ p.name }}</td>
        <td>{{ p.price }}</td>
        <td>{{ p.description }}</td>
        <td>{{ p.date }}</td>
        <td>
          <button @click="del(i)">&times;</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      form: {
        name: '',
        price: '',
        description: '',
        date: ''
      },
      products: []
    }
  },
  methods: {
    async send () {
      try {
        const { data } = await this.axios.post('http://localhost:3000/products', this.form)
        if (data.success) {
          alert('已送出')
          // 上面資料送出，下方表格同步更新
          this.products.push(data.result)
        } else {
          // 在 models\product.js 設定的 required
          alert(data.message)
        }
      } catch (error) {
        // 在 controllers\products.js 中設定的判斷
        alert(error.response.data.message)
      }
    },
    async del (i) {
      try {
        const { data } = await this.axios.delete('http://localhost:3000/products/' + this.products[i]._id, this.form)
        if (data.success) {
          // 刪除第 i 個往後數 1 筆
          this.products.splice(i, 1)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    }
  },
  async mounted () {
    const { data } = await this.axios.get('http://localhost:3000/products')
    this.products = data.result
  }
}
</script>
