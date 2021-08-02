# Creat ESLint
- F1 輸入 Creat ESLint configuration
  eslint --init
- 如果上面指令不行，可能是路徑跑掉
  "./node_modules/.bin/eslint" eslint --init 

- ? How would you like to use ESLint? ... (要怎麼使用 ESLint)
  To check syntax only (檢查語法)
  To check syntax and find problems (檢查語法、找到問題)
√ To check syntax, find problems, and enforce code style (檢查語法、找到問題，並強制程式碼風格)
     
- What type of modules does your project use? (要使用什麼語法)
√ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

- Which framework does your project use? (使用什麼框架)
  React
  Vue.js
√ None of these

- Does your project use TypeScript? (有沒有使用 TypeScript)
  √ No / Yes

- Where does your code run? (你的 code 在哪裡執行)
  Browser (瀏覽器)
√ Node
  - tips: 按空白鍵可以選取或取消選取

- How would you like to define a style for your project? (你要怎麼去定義你的程式碼風格)
√ Use a popular style guide (使用大家的風格)
  Answer questions about your style
  Inspect your JavaScript file(s)


- Which style guide do you want to follow? (要怎麼定義我們使用的程式碼風格)
  Airbnb: https://github.com/airbnb/javascript
  Standard: https://github.com/standard/standard
  Google: https://github.com/google/eslint-config-google

- What format do you want your config file to be in? (eslint 檔要存什麼格式)
  JavaScript
  YAML
√ JSON

Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1 || ^5.0.0
√ Would you like to install them now with npm? (要不要幫忙安裝以上 eslint 相關套件)
  No / √ Yes


### 語瑭筆記
 0. 終端機位置設定★★★
cd _____(路徑名稱)

1. 安裝 node module，建立 package.json ★★★
npm init --yes

並在 package.json 內新增
 "type": "module"
及
"scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },

2.  安裝 eslint
npm i -D eslint

3.  啟動伺服器 ★★★
npm run serve  => vue 
npm run dev => node

4. 安裝 nodemon
npm i -D nodemon

5. 安裝 axios
npm i axios

6. 清除快取★
npm cache clean -f

7. 安裝 vue 開發工具 ★★★
npm i -g @vue/cli

8. 建立 vue 專案★★★
vue create _____(專案名稱)

9. 安裝預處理器 pug
npm i  -D pug pug-plain-loader

10. 安裝 stylus
stylus style.stylus -w

11. 安裝 vue bootstrap 套件
vue add bootstrap-vue