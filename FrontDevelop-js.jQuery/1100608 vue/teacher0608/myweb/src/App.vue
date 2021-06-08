<template lang='pug'>
#app
  b-navbar(toggleable='lg' type='dark' variant='info')
    b-container
      b-navbar-brand(to='/') 我的網站
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav
          b-nav-item(to='/product')
            font-awesome-icon(:icon='["fas", "gift"]')
            | 商品
  router-view
</template>
