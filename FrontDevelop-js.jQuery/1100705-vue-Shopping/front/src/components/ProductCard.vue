<template lang="pug">
b-card.product-card.mb-2(
  :title="product.name"
  :sub-title="'$'+product.price"
  img-top
  :img-src="product.image"
)
  b-card-text(style="white-space: pre-line;") {{ product.description }}
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>
