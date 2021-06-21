<template>
  <div id="app">
    <form @submit.prevent="register">
      <h1>註冊</h1>
      帳號: <input type="text" v-model="form.account">
      <br>
      密碼: <input type="password" v-model="form.password">
      <br>
      信箱: <input type="email" v-model="form.email">
      <br>
      年齡: <input type="number" v-model="form.age" min="0" max="110">
      <br>
      <input type="submit" value="註冊">
    </form>
    <hr>
    <h1>使用者</h1>
    <table border="1">
      <tr v-for="(user, i) in users" :key="user._id">
        <td>
          <input type="text" v-model="user.account">
        </td>
        <td>
          <input type="email" v-model="user.email">
        </td>
        <td>
          <input type="number" v-model="user.age">
        </td>
        <td>
          <input type="button" value="刪除" @click="del(i)">
          <input type="button" value="更新" @click="update(i)">
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      form: {
        account: '',
        password: '',
        email: '',
        age: 0
      },
      users: []
    }
  },
  methods: {
    async register () {
      try {
        const { data } = await this.axios.post('http://localhost:3000/users', this.form)
        if (data.success) {
          this.users.push(data.result)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    async del (i) {
      try {
        const { data } = await this.axios.delete('http://localhost:3000/users/' + this.users[i]._id)
        if (data.success) {
          this.users.splice(i, 1)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    async update (i) {
      try {
        const send = Object.assign({}, this.users[i])
        delete send.password
        delete send._id
        const { data } = await this.axios.patch('http://localhost:3000/users/' + this.users[i]._id, send)
        if (data.success) {
          alert('更新成功')
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    }
  },
  async mounted () {
    const { data } = await this.axios.get('http://localhost:3000/users')
    this.users = data.result
  }
}
</script>
