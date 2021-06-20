# vue-fontawesome 安裝

- 安裝核心套件
 - npm install @fortawesome/fontawesome-svg-core 

- 依需求安裝各類 icon，可先在網站上確認樣式，再決定安裝哪個，不要全都安裝占空間
 - "fas" ← npm install @fortawesome/free-solid-svg-icons
 - "far" ← npm install @fortawesome/free-regular-svg-icons
 - "fab" ← npm install @fortawesome/free-brands-svg-icons

- 在 main.js 引用套件和要使用的 icon
 - // 必要引用
 - import { library } from '@fortawesome/fontawesome-svg-core'
 - import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
 - // 根據 icon 的種類引用
 - import { faXXX } from '@fortawesome/free-solid-svg-icons'
 - library.add(faXXX, .........);
 
 - // 註冊元件
 - Vue.component('font-awesome-icon', FontAwesomeIcon)

- 在其他檔案內使用
 - font-awesome-icon(:icon='["fas", "XXX"]')
 - "fas" → solid
 - "far" → regular
 - "fab" → brands