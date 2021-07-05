// mixin 內的 function 是處理

export default {
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
