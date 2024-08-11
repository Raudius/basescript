<template>
  <div>
    <button @click="$emit('submit', 'clicked')">
      {{ text }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'InputButton',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ['submit'],
  computed: {
    text() {
      return this.data.text ?? 'Click me'
    },
  },
}
</script>
