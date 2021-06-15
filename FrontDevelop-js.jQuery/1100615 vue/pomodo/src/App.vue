<template lang="pug">
  #app
    b-navbar(toggle='lg' type='secondary' variant='danger')
      b-container
        b-navbar-brand(to='/') 番茄鐘
        b-navbar-toggle(target='navbar-collapse')
        b-collapse#navbar-collapse(is-nav)
          b-navbar-nav.ml-auto
            b-nav-item(to='/list') 清單
            b-nav-item(to='/settings') 設定
    keep-alive
      router-view
</template>
