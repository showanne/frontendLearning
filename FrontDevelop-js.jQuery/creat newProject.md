#專題

## back
1. npm init --yes
2. package.json
   "type": "module"
   "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
   },
3. 安裝套件
  - 一般 npm i mongoose express cors body-parser md5 validator multer multer-ftp dotenv jsonwebtoken
  - 開發 npm i -D nodemon -D eslint
    - eslint --init 設定

E:\GitHub\DTNS-back>eslint --init
√ How would you like to use ESLint? · style       
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · node
√ How would you like to define a style for your project? · guide
√ Which style guide do you want to follow? · standard
√ What format do you want your config file to be in? · JSON

√ Would you like to install them now with npm? · No / Yes

4. 建 .env 及 .env.sample
5. .gitignore


## front
1. vue create 檔名
E:\GitHub\DTNS-back>vue create xx
Vue CLI v4.5.13
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Choose Vue version
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
 (*) Choose Vue version
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Choose Vue version
? Check the features needed for your project: Choose Vue version, Babel, Router, Vuex, CSS Pre-processors
? Choose a version of Vue.js that you want to start the project with 2.x
? Use history mode for router? (Requires proper server setup for index fallback in production) No
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Stylus
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? No

2. cd 檔名
3. vue add bootstrape-vue
4. npm i -D pug pug-plain-loader
5. 