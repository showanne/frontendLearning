# vue create pomodoro

1. vue create pomodoro
 - Manually select features (手動選擇功能)
 - check  空白鍵是選擇
  1. Choose Vue version
  2. Babel
  3. Progressive Web App (PWA) Support
  4. Router
  5. Vuex
  6. CSS Pre-processors
  7. Linter / Formatter
 - Choose Vue  > 2.x
 - Use history mode for router?  > N
 - Pick a CSS Pre-processors > Stylus
 - Pick a linter / formatter connfig: > ESLint + Standard config
 - Pick additional lint features: > Lint on save
 - Where.... > In dedicated config files (個別存)
 - Save.... > N (是否將這些設定當作預設? No)

### 在做下列這些步驟前記得先 cd 剛剛創建的資料夾避免裝錯地方

2. npm i -D pug pug-plain-loader (安裝預處理器 pug)

3. vue add bootstrap-vue (安裝 bootstrap-vue)
 -  WARN  There are uncommitted changes in the current repository, it's recommended to commit or stash them first.
 　? Still proceed? >　Yes
 - Use babel/polyfill? ＞　Yes

4. 清理資料夾
 - App.vue 留 <template lang='pug'> #app
 - views / Home.vue 留 <template lang='pug'> #home
           About.vue 刪除
 - assets 內刪除 logo.png
 - components 內刪除 HelloWorld.vue
 - router 內 index.js 將 '/about' 註解掉留之後備用

5. npm run serve 可以直接開網頁