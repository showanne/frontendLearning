<template lang="pug">
  //- https://www.surveycake.com/admin/tw/survey/6neyv/chart
  #msg
    b-container.mb-5
        b-row
          b-col(cols='12')
            h1.my-3
              font-awesome-icon(:icon='["fas","comments"]').h2
              span.ml-2 私房交流
        b-row
          b-col(cols='12')
            div.w-75.mx-auto
              b-form(@submit='onSubmit' @reset='onReset' v-if='show')
                b-form-group#input-group-2(label='您的大名：' label-for='input-2')
                  b-form-input#input-2(v-model='form.name' placeholder='請輸入您的大名' required)
                b-form-group#input-group-1(label='電子信箱：' label-for='input-1' description='We.')
                  b-form-input#input-1(v-model='form.email' type='email' placeholder='請輸入您的電子信箱' required)
                b-form-group#input-group-3(label='想對哪項產品提供建議：' label-for='input-3')
                  b-form-select#input-3(v-model='form.food' :options='foods' required)
                  b-form-textarea#input-3(v-model='form.foodtext' placeholder='歡迎給予指教及回饋喔 ^^' required).mt-2
                b-form-group#input-group-4(label='您對於本次訂購的產品滿意程度：' label-for='input-4')
                  b-form-select#input-4(v-model='form.satisfaction' :options='satisfactions' required)
                b-form-group#input-group-5(label='這是您第幾次訂購黃媽媽的產品？' label-for='input-5')
                  b-form-select#input-5(v-model='form.order' :options='orders' required)
                b-form-group#input-group-6(v-slot='{ ariaDescribedby }')
                  b-form-checkbox-group#checkboxes-6(v-model='form.checked' :aria-describedby='ariaDescribedby')
                    b-form-checkbox(value='recommend') 會推薦黃媽媽的料理給親朋好友嗎？
                    b-form-checkbox(value='un-recommend') 不推薦
                b-button(type='submit' variant='primary').mx-1 Submit
                b-button(type='reset' variant='danger').mx-1 Reset
              //- b-card.mt-3(header='Form Data Result')
                //- pre.m-0 {{ form }}
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      form: {
        email: '',
        name: '',
        food: null,
        foodtext: '',
        satisfaction: null,
        order: null,
        checked: []
      },
      foods: [{ text: '請選一個', value: null }, '糖心蛋', '酒蛋', '鐵蛋', '蛋蛋'],
      satisfactions: [{ text: '請選一個', value: null }, '好吃到說不出話來', '阿不就跟普通市場買的一樣', '覺得難吃 (選這個選項黃媽媽會傷心的喔 QQ'],
      orders: [{ text: '請選一個', value: null }, '第1次', '第2~5次', '5次以上', '多到數不清了'],
      show: true
    }
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.foodtext = ''
      this.form.satisfaction = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
