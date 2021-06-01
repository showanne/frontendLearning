module.exports = {
  // 設定網頁的 title
  pages: {
    index: {
      // 設定 title 時一定要有 entry，打 main.js 路徑就好
      entry: './src/main.js',
      // 網頁的 title
      title: '科技高中'
    }
  },
  // 設定輸出時的 css 和 js 的路徑，不設定的話會是 /，代表磁碟根目錄
  publicPath: './'
}