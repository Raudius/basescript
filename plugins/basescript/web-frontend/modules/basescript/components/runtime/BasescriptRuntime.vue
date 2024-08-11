<template>
  <div class="basescript-runtime">
    <component
      :is="parseIoComponentType(ioElement.type)"
      v-for="ioElement in ioElements"
      :key="ioElement.id"
      class="runtime-section"
      :data="ioElement.data"
      @submit="ioElement.cb"
    ></component>
  </div>
</template>

<script>
import { BasescriptClient } from '@basescript/runtime/client'
import { Basescript } from '@basescript/runtime/runtime'
import InputButton from '@basescript/components/runtime/InputButton'
import SelectRow from '@basescript/components/runtime/InputSelectRow'
import OutputText from '@basescript/components/runtime/OutputText'
import OutputTable from '@basescript/components/runtime/OutputTable'

export default {
  name: 'BasescriptRuntime',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  emits: ['exit'],
  data() {
    return {
      runtime: null,
      ioElements: [],
    }
  },
  mounted() {
    const thisComponent = this
    const ioHandler = {
      push(cb, type, data) {
        const id = thisComponent.ioElements.length + 1
        thisComponent.ioElements.push({ cb, type, data, id })
      },
    }

    const workspaceId = this.collection.workspace.id
    const client = BasescriptClient(workspaceId, this.$client, ioHandler)
    this.runtime = Basescript(client, {
      stopped() {
        thisComponent.$emit('exit')
      },
    })
  },
  methods: {
    runScript(code) {
      this.ioElements = []
      this.runtime.run(code)
    },
    stopExecution() {
      this.runtime.kill()
    },
    parseIoComponentType(type) {
      switch (type) {
        case 'select-row':
          return SelectRow
        case 'button':
          return InputButton
        case 'text':
          return OutputText
        case 'table':
          return OutputTable
      }
    },
  },
}
</script>

<style scoped>
.basescript-runtime {
  margin: 10px;
}
.runtime-section {
  margin: 8px;
}
</style>
