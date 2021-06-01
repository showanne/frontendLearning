<template lang="pug">
#top
  //- public 放靜態圖片，每次更新都長一樣的圖片
  //- src 的 assets 放動態圖片，每次更新都長不一樣的圖片，打包時檔名會加上流水號
  //- 如果圖片在 public，必須用 :src 裡面放字串，./ 代表 public 資料夾
  //- 如果圖片在 src，不能用 :src，直接 ./ 找相對路徑，或是 @/ 代表 src 資料夾
  img(:src="'./logo.png'")
</template>

<script>
export default {
  name: 'Top'
}
</script>
