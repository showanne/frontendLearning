<template lang="pug">
#app
  Top
  #mid
    #left
      Menu
    #right
</template>

<script>
// import Top 及 上方 <template> Top 及 下方 components Top 都需相同 且大寫
import Top from './components/Top.vue'
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  components: {
    Top,
    Menu
  }
}
</script>
