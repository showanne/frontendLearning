# 建立 vue 環境

1. vue create 資料夾名稱

- Manually select features (手動選擇功能)
- check 空白鍵是選擇

1. Choose Vue version 
2. Babel 
3. Progressive Web App (PWA) Support 
4. Router 
5. Vuex 
6. CSS Pre-processors 
7. Linter / Formatter 

  - Babel 語法轉譯以支援舊瀏覽器
  - TypeScript 使用 TypeScript 語言編寫網頁
  - Progressive Web App (PWA) Support 支援 PWA
  - Router 網站路由管理套件
  - Vuex 網站狀態管理套件
  - CSS Pre-processors CSS 預處理器，可以編寫 SCSS、LESS、Stylus 等
  - Linter / Formatter 程式碼驗證與格式化工具，就是在做 LINE 機器人時用到的 ESLint
  - Unit Testing 與 E2E Testing 為網站測試工具

- Choose Vue > 2.x
- Use history mode for router? > N
- Pick a CSS Pre-processors > Stylus
- Pick a linter / formatter connfig: > ESLint + Standard config
- Pick additional lint features: > Lint on save
- Where do you prefer placing config for Babel, ESLint, etc.? > In dedicated config files (個別存)
- Save this as a preset for future projects? > N (是否將這些設定當作預設? No)

### 在做下列這些步驟前記得先 cd 剛剛創建的資料夾避免裝錯地方

2. npm i -D pug pug-plain-loader (安裝預處理器 pug)

3. vue add bootstrap-vue (安裝 bootstrap-vue)

- WARN There are uncommitted changes in the current repository, it's recommended to commit or stash them first.
  (詢問還沒 commit 是否要繼續?)
  　? Still proceed? >　 √ Yes
- Use babel/polyfill? ＞　 √ Yes
  (是否要將新語法翻譯成舊瀏覽器也支援的語法)

4. 清理資料夾

- App.vue 留 <template lang='pug'> #app
- views / Home.vue 留 <template lang='pug'> #home
  About.vue 刪除
- assets 內刪除 logo.png
- components 內刪除 HelloWorld.vue
- router 內 index.js 將 '/about' 註解掉留之後備用

5. npm run serve 可以直接開網頁
