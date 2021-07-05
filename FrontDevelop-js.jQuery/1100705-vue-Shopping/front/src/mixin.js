// mixin 與 getters 的差異
// mixin (Vue) 作用：把每個元件會用到的 computed、methods、function...拉到一起寫，可以在其他分頁直接引用
// getters (Vuex) 是先將 Vuex 的資料處理後，再return出來

export default {
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
