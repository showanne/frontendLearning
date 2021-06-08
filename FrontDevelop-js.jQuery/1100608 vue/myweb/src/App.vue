<template lang="pug">
  #app
    b-navbar(toggleable='lg' type='light' variant='warning')
      b-container
        b-navbar-brand(href='/')
          img(:src='require("./assets/logoHuang.svg")' width='70')
          span.h2.text-light 媽媽私房料理
        b-navbar-toggle(target='nav-collapse')
        b-collapse#nav-collapse(is-nav).mr-5
          b-navbar-nav
            b-nav-item(to='/award')
              font-awesome-icon(:icon='["fas", "award"]')
              span.ml-2 私房獎項
              //- 在需要使用 icon 的地方引用元件
              //- font-awesome-icon(:icon='["fas", "coffee"]')  單引號內要雙引號
            b-nav-item(to='/product')
              font-awesome-icon(:icon='["fas","hand-holding-heart"]')
              span.ml-2 私房料理
            b-nav-item(to='/msg')
              font-awesome-icon(:icon='["fas", "comments"]')
              span.ml-2 私房交流
    router-view
</template>
