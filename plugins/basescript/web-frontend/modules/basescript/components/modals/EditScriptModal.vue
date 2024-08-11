<template>
  <Modal
    :right-sidebar-scrollable="true"
    :can-close="true"
  >
    <template #content>
      <div class="import-modal__header">
        <h2 class="import-modal__title">{{ name }}</h2>

        <div class="modal__actions">
          <a class="modal__close">
            <i class="iconoir-cancel"></i>
          </a>
        </div>
      </div>

      <ScriptForm ref="scriptForm" :default-name="script?.name ?? ''" :default-code="script?.code ?? ''" @submitted="submitted" />
      <div class="align-right">
        <Button
          type="primary"
          size="large"
          :loading="false"
          @click="$refs.scriptForm.submit()"
        >
          {{ isScriptCreation ? 'Create script' : 'Save' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script>
import modal from '@baserow/modules/core/mixins/modal'
import error from '@baserow/modules/core/mixins/error'
import jobProgress from '@baserow/modules/core/mixins/jobProgress'
import ScriptForm from '../script/ScriptForm.vue'

export default {
  name: 'ImportFileModal',
  components: { ScriptForm },
  mixins: [modal, error, jobProgress],
  props: {
    collection: {
      type: Object,
      required: true,
    },
    script: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {
    name() {
      return this.script ? this.script.name : 'New script'
    },
    isScriptCreation() {
      return this.script === null
    },
  },
  methods: {
    async submitted(formValues) {
      const storeAction = this.isScriptCreation
        ? 'script/create'
        : 'script/update'

      try {
        await this.$store.dispatch(storeAction, {
          collection: this.collection,
          script: this.script,
          values: formValues,
        })

        this.hide()
      } catch (error) {
        // TODO handle error
      }
    },
  },
}
</script>
