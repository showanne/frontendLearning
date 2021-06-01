<template lang="pug">
#menu
  | 社團介紹
  table
    tr(v-for="(club, i) in clubs" :key="i")
      //- public 放靜態圖片，每次更新都長一樣的圖片
      //- src 的 assets 放動態圖片，每次更新都長不一樣的圖片，打包時檔名會加上流水號
      //- 如果圖片在 public，必須用 :style 放背景圖，./ 代表 public 資料夾
      //- 如果圖片在 src，不能用 :style，直接 ./ 找相對路徑，或是 @/ 代表 src 資料夾，或是寫在 CSS 裡面
      td {{ club }}
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      clubs: [
        '吉他社',
        '熱舞社',
        '棒球社',
        '羽球社',
        '足球社',
        '童軍社'
      ]
    }
  }
}
</script>
