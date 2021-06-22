# Creat ESLint
- F1 輸入 Creat ESLint configuration
  E:\GitHub\frontendLearning\FrontDevelop-js.jQuery>node_modules\.bin\eslint.cmd --init
√ How would you like to use ESLint?
 · style       
√ What type of modules does your project use?
 · esm
√ Which framework does your project use?
 · none
√ Does your project use TypeScript?
 · No / Yes
√ Where does your code run?
 · node
√ How would you like to define a style for your project?
 · guide
√ Which style guide do you want to follow?
 · standard    
√ What format do you want your config file to be in?
 · JSON

Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1 || ^5.0.0
√ Would you like to install them now with npm?
 · No / Yes


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