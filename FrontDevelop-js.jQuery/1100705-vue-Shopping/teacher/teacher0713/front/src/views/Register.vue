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
        account: account.length === 0 ? null : account.length >= 4 && account.length <= 20,
        password: password.length === 0 ? null : password.length >= 4 && password.length <= 20,
        email: email.length === 0 ? null : isEmail(email)
      }
    }
  },
  methods: {
    reset () {
      this.form.account = ''
      this.form.password = ''
      this.form.email = ''
    },
    async submit () {
      try {
        await this.axios.post('/users', this.form)
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '註冊成功'
        })
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
