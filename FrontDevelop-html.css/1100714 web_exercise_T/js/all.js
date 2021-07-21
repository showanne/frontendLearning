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
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
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
