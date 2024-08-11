<template>
  <div>
    <button @click="$refs.selectModal.show()">Select row...</button>
    <SelectRowModal
      ref="selectModal"
      :table-id="data.tableId"
      :multiple="false"

      @selected="selected"
    ></SelectRowModal>
  </div>
</template>

<script>
import SelectRowModal from '@baserow/modules/database/components/row/SelectRowModal'

export default {
  name: 'InputSelectRow',
  components: { SelectRowModal },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ['submit'],
  methods: {
    selected(value) {
      this.$refs.selectModal.hide()
      this.$emit('submit', value)
    },
  }
}
</script>
