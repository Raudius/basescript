<template>
  <div>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'OutputText',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ['submit'],
  computed: {
    text() {
      return this.data.text ?? ''
    },
  },
  mounted() {
    this.$emit('submit')
  },
}
</script>
