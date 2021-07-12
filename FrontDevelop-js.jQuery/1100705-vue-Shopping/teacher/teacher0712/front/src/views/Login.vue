<template lang="pug">
b-container#register
  b-row
    b-col(cols="12")
      h1.text-center 登入
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
        .text-center
          b-btn.mx-1(variant="success" type="submit") 登入
          b-btn.mx-1(variant="danger" type="reset") 重設
</template>

<script>
export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  computed: {
    state () {
      const account = this.form.account
      const password = this.form.password
      return {
        account: account.length === 0 ? null : account.length >= 4 && account.length <= 20,
        password: password.length === 0 ? null : password.length >= 4 && password.length <= 20
      }
    }
  },
  methods: {
    reset () {
      this.form.account = ''
      this.form.password = ''
    },
    async submit () {
      try {
        const { data } = await this.axios.post('/users/login', this.form)
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
        this.$store.commit('login', data)
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
