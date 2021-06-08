<template lang="pug">
#update
  | 最後更新日期: {{ date }}
</template>

<script>
export default {
  name: 'Update',
  data () {
    return {
      date: new Date().toLocaleDateString()
    }
  }
}
</script>
