<template lang="pug">
  #guitar
    h1 吉他社教學內容
    router-view(to='/') 回社團介紹首頁
    router-view(to='/guitar') 吉他社社史
    router-view(to='/guitar/event') 吉他社近期活動公告

</template>
