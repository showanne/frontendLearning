module.exports = {
  publicPath: './',
  pwa: {
    pwa: {
      // manifest.json 的設定
      manifestOptions: {
        // APP 名稱
        name: '番茄鐘',
        // 手機主畫面 APP 名稱
        short_name: '番茄鐘',
        // APP 主題顏色
        theme_color: '#4AD',
        // APP 啟動畫面背景色
        background_color: '#3FA',
        // APP 顯示範圍
        scope: './',
        // APP 開始畫面網址
        start_url: './',
        // 顯示模式
        // browser: 瀏覽器
        // fullscreen: 全螢幕，隱藏所有瀏覽器 UI
        // standard: 隱藏標準瀏覽器 UI ，如 URL 欄
        // minimal-ui: 有最小導覽列 UI (下一頁、重整)，Chrome不支援
        // standalone: 沒有最小導覽列 UI (下一頁、重整)
        display: 'standalone',
        // 來自 public\img\icons\manifest.json 轉換的
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: './img/icons/android-chrome-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: './img/icons/android-chrome-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: './img/icons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png'
          },
          {
            src: './img/icons/apple-touch-icon-76x76.png',
            sizes: '76x76',
            type: 'image/png'
          },
          {
            src: './img/icons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png'
          },
          {
            src: './img/icons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: './img/icons/apple-touch-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: './img/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: './img/icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: './img/icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: './img/icons/msapplication-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: './img/icons/mstile-150x150.png',
            sizes: '150x150',
            type: 'image/png'
          }
        ]
      }
    }
  }
}
