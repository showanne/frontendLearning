<template lang='pug'>
#guitar
  h1 吉他社社史
  router-link(to='/') 回社團介紹首頁
  router-link(to='/guitar/event') 近期活動公告
  router-link(to='/guitar/learning') 教學內容
</template>

<script>
export default {
  name: 'Guitar'
}
</script>
