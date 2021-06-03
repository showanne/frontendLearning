var player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '', // youtube 影片 ID
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1, // 自動播放影片
      controls: 1, // 顯示播放器
      showinfo: 1, // 隱藏影片標題
      modestbranding: 1, // 隱藏YouTube Logo
      loop: 1, // 重覆播放
      playlist: '', // 當使用影片要重覆播放時，需再輸入YouTube 影片ID
      fs: 0, // 隱藏全螢幕按鈕
      cc_load_policty: 0, // 隱藏字幕
      iv_load_policy: 3, // 隱藏影片註解
      autohide: 0, // 影片播放時，隱藏影片控制列
    },
    events: {
      onReady: onPlayerReady,
    },
  })
}
function onPlayerReady(e) {
  // 為確保瀏覽器上可以自動播放，要把影片調成靜音
  // e.target.mute().playVideo();
  e.target.playVideo()
}
