<template>
  <div>Starting example!</div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const response = await app.$client.get(
      'my_baserow_plugin/starting/'
    )
    return response.data
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
