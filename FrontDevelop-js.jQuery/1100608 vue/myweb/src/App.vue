<template lang="pug">
  #app
    b-navbar(toggleable='lg' type='dark' variant='warning')
      b-container
        b-navbar-brand(href='#') Myweb
        b-navbar-toggle(target='nav-collapse')
        b-collapse#nav-collapse(is-nav)
          b-navbar-nav
            b-nav-item(to='/product')
              font-awesome-icon(:icon='["fas", "award"]')
              | 得獎
              //- 在需要使用 icon 的地方引用元件
              //- font-awesome-icon(:icon='["fas", "coffee"]')  單引號內要雙引號
            b-nav-item(href='#') 私房料理
            //- <i class="fas fa-comments"></i>
            b-nav-item(href='#') 私房交流
    router-view
</template>
