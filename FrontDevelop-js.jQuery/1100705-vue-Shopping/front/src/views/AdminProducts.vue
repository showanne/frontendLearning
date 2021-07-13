<template lang="pug">
  #adminproducts.mt-3
    b-btn(block variant="success" @click="$bvModal.show('modal-product')").my-3 新增
    b-table(
      :items="products"
      :fields="fields"
      ref="productTable"
    )
      template(#cell(image)="data")
        img(
          v-if="data.item"
          :src="data.item.image"
          style="height: 50px"
        )
      template(#cell(description)="data").w-25
        | {{ data.item.description }}
      template(#cell(sell)="data")
        | {{ data.item.sell ? '√' : '' }}
      template(#cell(action)="data")
        b-btn(
          @click="editProduct(data.index)"
          variant="outline-success"
          squared size="sm"
        ) 編輯
        //- b-btn(variant="danger" squared size="sm").mx-2 刪除(編輯的下架)
    b-modal#modal-product(
      :title="form._id.length > 0 ? '編輯商品' : '新增商品'"
      ok-variant="success"
      ok-title="送出"
      cancel-variant="outline-danger"
      cancel-title="取消"
      @ok="submitModal"
      @hidden="resetForm"
      :ok-disabled="submitDisable"
      :cancel-disabled="submitDisable"
    )
      //- @hidden= 點到 modal 外會跳出 modal框 就清除全部表格資料
      //- :ok-disabled :cancel-disabled 送出表單後的按鈕狀態設定
      //- form._id.length > 0 如果 商品id 長度大於 0 顯示編輯，另外則顯示新增
      b-form-group(
        label="品名"
        label-for="input-name"
        :state="state.name"
        description="品名長度限制為 1 個字以上"
        invalid-feedback="品名格式不正確"
      )
        b-form-input#input-name(
          v-model="form.name"
          type="text"
          required
          placeholder="請輸入品名"
          :state="state.name"
        )
      b-form-group(
        label="價格"
        label-for="input-price"
        :state="state.price"
        description="價格限制為 0 以上"
        invalid-feedback="價格格式不正確"
      )
        b-form-input#input-price(
          v-model.number="form.price"
          type="number"
          required
          placeholder="請輸入價格"
          :state="state.price"
        )
      b-form-group(
        label="說明"
        label-for="input-description"
      )
        b-form-textarea#input-description(
          v-model="form.description"
          type="text"
          placeholder="請輸入說明文字"
        )
      b-form-group(
        label="上架"
        label-for="input-sell"
      ).d-inline-block
        //- b-form-radio-group#radio-slots
          //- (v-model='selected' :options='options' :aria-describedby='ariaDescribedby' name='radio-options-slots')
        b-form-radio(v-model="form.sell" :value="true" inline) 上架
        b-form-radio(v-model="form.sell" :value="false" inline) 下架
      //- img-inputer 上傳檔案的套件
      img-inputer(i
        v-model="form.image"
        theme="dark" size="large"
        placeholder="點擊或拖曳選擇圖片"
        bottom-text="點擊或拖曳以修改")
</template>

<script>
export default {
  data () {
    return {
      products: [],
      fields: [
        { key: 'image', label: '圖片' },
        { key: 'name', label: '品名' },
        { key: 'price', label: '價格' },
        { key: 'description', label: '說明' },
        { key: 'sell', label: '上架' },
        { key: 'action', label: '操作' }
      ],
      // 送出表單後的按鈕狀態設定
      submitDisable: false,
      form: {
        name: '',
        price: 0,
        description: '',
        sell: false,
        image: null,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        // name: true 驗證通過
        name: this.form.name.length === 0 ? null : true,
        price: this.form.price === 0 ? null : this.form.price > 0
      }
    }
  },
  methods: {
    editProduct (index) {
      // 編輯時，將商品資料填入 modal
      this.form = {
        name: this.products[index].name,
        price: this.products[index].price,
        description: this.products[index].description,
        sell: this.products[index].sell,
        image: this.products[index].image,
        _id: this.products[index]._id,
        index
      }
      // 點擊按鈕後，將 modal 顯示
      this.$bvModal.show('modal-product')
    },
    resetForm (event) {
      // preventDefault
      // 處理 更新商品後即時更新資料
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        name: '',
        price: 0,
        description: '',
        sell: false,
        image: null,
        _id: ''
      }
    },
    async submitModal () {
      // 送出表單後 + 資料還在傳送進資料庫時 按鈕狀態設定為不能點擊，避免重複送出
      this.submitDisable = true
      try {
        // FormData 資料類型 可以送出一般文字及檔案
        // new FormData() 新增一個 FormData 的 資料類型
        // 前端送出的資料類型 FormData  後端接收資料型態為 multipart/form-data
        const fd = new FormData()
        for (const key in this.form) {
          // .append 將資料放進 FormData
          // 要傳進的欄位 key → key  / value → this.form[key]
          fd.append(key, this.form[key])
        }
        if (this.form._id.length === 0) {
          // 新增商品會在 devtool 的 network 新增2筆 product，一筆是傳進後端，一筆是瀏覽器...?
          // 新增
          await this.axios.post('/products', fd, {
            // 驗證身分
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
        } else {
          // 更新
          const { data } = await this.axios.patch('/products/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.products[this.form.index] = {
            name: this.form.name,
            price: this.form.price,
            description: this.form.description,
            sell: this.form.sell,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            _id: this.form._id
          }
          // 強制 Table 重新整理...?
          this.$refs.productTable.refresh()
        }
        // 資料送出後，將 modal 關閉
        this.$bvModal.hide('modal-product')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
      // 送出表單後 + 資料已傳進資料庫時 按鈕狀態設定為可以點擊
      this.submitDisable = false
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/products/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.products = data.result.map(product => {
        if (product.image) {
          product.image = `${process.env.VUE_APP_API}/files/${product.image}`
        }
        return product
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得商品失敗'
      })
    }
  }
}
</script>
