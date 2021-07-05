<template lang="pug">
  b-container#register
    b-row
      b-col(cols="12")
        h1.text-center 註冊
      b-col(cols="12")
        b-form(@submit.prevent="submit" @reset="reset")
          b-form-group(
            label="帳號"
            label-for="input-account"
            :state="state.account"
            description="帳號長度限制為 4 到 20 個字"
            invalid-feedback="帳號格式不正確"
          )
            //- label= input 上方 label 的字
            //- label-for= 對應的 input id
            //- description= 輸入框下面的描述
            //- invalid-feedback= 驗證文字
            b-form-input#input-account(
              v-model="form.account"
              type="text"
              required
              placeholder="請輸入帳號"
              :state="state.account"
            )
          b-form-group(
          label="密碼"
          label-for="input-password"
          :state="state.password"
          description="密碼長度限制為 4 到 20 個字"
          invalid-feedback="密碼格式不正確"
          )
            b-form-input#input-password(
              v-model="form.password"
              type="password"
              required
              placeholder="請輸入密碼"
              :state="state.password"
            )
          b-form-group(
            label="信箱"
            label-for="input-email"
            :state="state.email"
            description="請輸入有效的信箱"
            invalid-feedback="信箱格式不正確"
          )
            b-form-input#input-email(
              v-model="form.email"
              type="text"
              required
              placeholder="請輸入信箱"
              :state="state.email"
            )
          .text-center
            b-btn.mx-1(variant="success" type="submit") 註冊
            b-btn.mx-1(variant="danger" type="reset") 重設
</template>

<script>
// validator 套件自訂驗證
// 單獨拉套件的其中一個功能，套件文件有寫
// es 瀏覽器
import isEmail from 'validator/es/lib/isEmail'

export default {
  data () {
    return {
      form: {
        account: '',
        password: '',
        email: ''
      }
    }
  },
  computed: {
    state () {
      const account = this.form.account
      const password = this.form.password
      const email = this.form.email
      return {
        // 驗證判斷帳號、密碼輸入
        // account.length >= 4 && account.length <= 20 結果會傳 true 和 false 所以後面可以省略
        account: account.length === 0 ? null : account.length >= 4 && account.length <= 20,
        password: password.length === 0 ? null : password.length >= 4 && password.length <= 20,
        // 信箱驗證判斷 交給 validator isEmail
        email: email.length === 0 ? null : isEmail(email)
      }
    }
  },
  methods: {
    // 表單內容重設，將內容清空
    reset () {
      this.form.account = ''
      this.form.password = ''
      this.form.email = ''
    },
    // 註冊
    async submit () {
      try {
        await this.axios.post('/users', this.form)
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '註冊成功'
        })
        // 註冊成功後導回首頁
        this.$router.push('/')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    }
  }
}
</script>
