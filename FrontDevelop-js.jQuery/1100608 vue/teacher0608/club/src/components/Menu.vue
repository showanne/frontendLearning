<template lang="pug">
#menu
  h1 社團介紹
  table
    tr(v-for='(club, i) in clubs' :key='i')
      td
        router-link(:to='club.link') {{ club.name }}
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      clubs: [
        { name: '吉他社', link: '/guitar' },
        { name: '熱舞社', link: '/dance' },
        { name: '棒球社', link: '/baseball' },
        { name: '羽球社', link: '/badminton ' },
        { name: '足球社', link: '/soccar' },
        { name: '童軍社', link: '/scouts' }
      ]
    }
  }
}
</script>
