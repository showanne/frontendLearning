<template lang='pug'>
#guitar
  h1 吉他社教學內容
  router-link(to='/') 回社團介紹首頁
  router-link(to='/guitar') 吉他社社史
  router-link(to='/guitar/event') 活動公告
</template>

<script>
export default {
  name: 'Guitar'
}
</script>
