<template>
  <div>
    <BaserowTable :rows="rows" :fields="fields">
      <template #field-name="{ field }">
        <th :key="field.id">
          {{ field.name }}
        </th>
      </template>
      <template #cell-content="{ rowIndex, field }">
        <td :key="field.id">
          {{ rows[rowIndex][`field_${field.id}`] ?? rows[rowIndex][field.name] }}
        </td>
      </template>
    </BaserowTable>
  </div>
</template>

<script>
import BaserowTable from '@baserow/modules/builder/components/elements/components/BaserowTable'

export default {
  name: 'OutputTable',
  components: { BaserowTable },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ['submit'],
  computed: {
    rows() {
      return this.data.rows ?? []
    },
    fields() {
      const fields = this.data.fields ?? []
      const row = this.rows[0] ?? null

      if (row) {
        return fields.filter((field) => {
          return (
            Object.hasOwn(row, field.name) ||
            Object.hasOwn(row, `field_${field.id}`)
          )
        })
      }
      return fields
    },
  },
  mounted() {
    this.$emit('submit')
  },
}
</script>
