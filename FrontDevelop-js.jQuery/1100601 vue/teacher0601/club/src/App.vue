<template lang="pug">
#app
  Top
  #mid
    #left
      Menu
    #right
</template>

<script>
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
