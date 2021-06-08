<template lang="pug">
#app
  Top
  #left
    Menu
    Update
  #right
    Marquee
    #content
      router-view
  Footer
</template>

<script>
import Top from './components/Top.vue'
import Menu from './components/Menu.vue'
import Update from './components/Update.vue'
import Marquee from './components/Marquee.vue'
import Footer from './components/Footer.vue'
export default {
  name: 'App',
  components: {
    Top,
    Menu,
    Update,
    Marquee,
    Footer
  }
}
</script>
