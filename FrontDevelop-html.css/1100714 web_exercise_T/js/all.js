// Modal
$('#reg_btn, #login_btn').on('click', function () {
  $('body,#navbar').css({
    overflow: 'auto',
    'padding-right': 0,
  })
})

// section03 生物種族
$('#race a').on('click', function () {
  $('#race a').removeClass('active')
  $(this).addClass('active')
})

// GSAP ---------------------------------------------------------------------------------------------------
// 註冊 plugin
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, SplitText)
//  ScrollToPlugin 滑動效果 ---------------------------------------------------------------------------------
$('#navbar .main-link,.backtop a').each(function (index, link) {
  $(this).on('click', function (e) {
    e.preventDefault() // 阻止 a 連結預設動作
    if (
      $(this).attr('href') == '#section04' ||
      $(this).attr('href') == '#section05'
    ) {
      gsap.to($(window), {
        scrollTo: {
          y: `#section0${index + 1}`,
        },
        duration: 1.5,
        ease: 'back.inOut',
      })
    } else {
      gsap.to($(window), {
        scrollTo: {
          y: `#section0${index + 1}`,
          offsetY: 150,
        },
        duration: 1.5,
        ease: 'back.inOut',
      })
    }
  })
})

// 補間動畫 ------------------------------------------------------------------------------------------------
// #navbar 動畫
gsap.from('#navbar', {
  y: -$('#navbar').height(),
  duration: 2,
  ease: 'back.inOut',
})

// 流星
// 創建流星數目
function createStar(starNumber) {
  for (let i = 0; i < starNumber; i++) {
    $('.shooting_star').append('<div class="star"></div>')
  }
  const stars = gsap.utils.toArray('.star')
  return stars
}

// 設定補間動畫預設值
function setTween(stars) {
  gsap.set('.shooting_star', { perspective: 800 })
  stars.forEach(function (star, index) {
    gsap.set(star, {
      transformOrigin: '0% 50% 100px',
      position: 'absolute',
      left: gsap.utils.random($(window).width() / 2, $(window).width() * 2),
      // left: `random(${$(window).width() / 2},${$(window).width() * 2})`,
      top: gsap.utils.random(-100, -200),
      rotation: -25,
    })
  })
  return stars
}

function playTimeline(stars) {
  const tl = gsap.timeline({ repeat: -1 })
  stars.forEach(function (star, index) {
    tl.to(
      star,
      {
        x: () => `-=${$(window).width() * 1.5}`,
        y: () => `+=${$(window).height() * 1.5}`,
        z: () => `random(50,500)`,
        duration: 1,
        delay: 'random(1,5)',
        ease: 'none',
      },
      '<' + gsap.utils.random(0, 5)
    )
  })
}

//  gsap.utils.pipe() 管道，將參數丟進函式，回傳的結果再丟入下一個函式
const playStar = gsap.utils.pipe(createStar, setTween, playTimeline)
playStar(30)

// ScrollTrigger 滾動軸 ------------------------------------------------------------------------------------
// backtop 回頂端，顯示/隱藏
gsap.to('.backtop', {
  scrollTrigger: {
    trigger: '#footer',
    start: 'top bottom',
    end: '100% bottom',
    toggleActions: 'play none none reverse',
    // markers: true,
  },
  display: 'block',
  opacity: 1,
  duration: 1,
})

// 導覽列 active 位置
$('.main-link').each(function (index, link) {
  let href = $(link).attr('href')
  console.log(href, link)
  gsap.to(link, {
    scrollTrigger: {
      trigger: `${href}`,
      start: 'top center',
      end: 'bottom center',
      toggleClass: {
        targets: link,
        className: 'active',
      },
      // markers: true,
    },
  })
})

// 視差效果 ----------------------------------------------------------------------------------------------------
// 星空背景
gsap.to('body', {
  scrollTrigger: {
    trigger: 'body',
    start: 'top 0%',
    end: 'bottom 0%',
    scrub: 5,
    // markers: true,
  },
  backgroundPosition: '50% 100%',
  ease: 'none',
})

// 浮空的島
const float_tl = gsap.timeline({
  scrollTrigger: {
    trigger: 'body',
    start: 'top 100%',
    end: 'bottom 100%',
    scrub: 5,
    // markers: true,
  },
  ease: 'none',
})

// 1. 使用 timeline 操作進場位置
float_tl
  .from('.float-wrap-01', {
    left: '-30%',
  })
  .from(
    '.float-wrap-02',
    {
      right: '-30%',
    },
    '<'
  )
  .from(
    '.float-wrap-03',
    {
      bottom: '-100%',
    },
    '<'
  )

// 2. 自身上下浮動使用 gsap.to()
$('.float-island').each(function (index, island) {
  gsap.to(island, {
    y: 50 * (index + 1),
    duration: 10 * (index + 1),
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  })
})

// 霧
$('.fog').each(function (index, fog) {
  gsap.set(fog, {
    width: '100%',
    height: '100%',
    background: `url(./images/fog.png) no-repeat center/80%`,
    opacity: 0.8,
    position: 'absolute',
    top: 'random(0,100)' + '%',
    x: function () {
      return index % 2 == 0 ? -$(window).width() : $(window).width()
    },
  })
  gsap.to(fog, {
    x: function () {
      return index % 2 == 0 ? $(window).width() : -$(window).width()
    },
    repeat: -1,
    duration: 60,
    ease: 'none',
    onRepeat() {
      $(fog).css({
        top: gsap.utils.random(0, 100) + '%',
      })
    },
  })
})

// SplitText -------------------------------------------------------------------------------------------
gsap.set('#splitText', { perspective: 400 })
const tl = gsap.timeline({ repeat: -1, repeatDelay: 8 })
// 取得 DOM 元素（它是類陣列）將其轉成真正的陣列
const paragraphs = gsap.utils.toArray('#splitText p')
// 使用陣列方法 map 將每個元素轉成 SplitText 實體放到新陣列
const splitText = paragraphs.map(function (p) {
  return new SplitText(p, {
    charsClass: 'charBg',
  })
})

splitText.forEach(function (item) {
  const chars = item.chars
  tl.from(
    chars,
    {
      y: 80,
      rotationX: 0,
      rotationY: 180,
      scale: 2,
      transformOrigin: '0% 50% 500',
      opacity: 0,
      duration: 2,
      ease: 'back',
      stagger: 0.1,
      onComplete() {
        gsap.to(chars, {
          delay: 3,
          duration: 2,
          opacity: 0,
          scale: 2,
          y: 80,
          rotationX: 180,
          rotationY: 0,
          transformOrigin: '0% 50% -100',
          ease: 'back',
          stagger: 0.1,
        })
      },
    },
    '+=3'
  )
})
