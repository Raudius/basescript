<template>
  <form @submit.prevent="submit">
    <FormGroup
      :error="fieldHasErrors('name')"
      required
      small-label
      class="margin-bottom-2"
    >
      <template #label><i class="iconoir-text"></i>Name</template>
      <FormInput
        ref="name"
        v-model="values.name"
        size="large"
        :error="fieldHasErrors('name')"
      >
      </FormInput>
      <template #error>
        {{ $t('error.requiredField') }}
      </template>
    </FormGroup>

    <FormGroup small-label class="margin-bottom-2">
      <template #label><i class="iconoir-code"></i>Code</template>
      <FormTextarea ref="code" v-model="values.code" :rows="12"></FormTextarea>
    </FormGroup>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import form from '@baserow/modules/core/mixins/form'
export default {
  name: 'ScriptForm',
  mixins: [form],
  props: {
    defaultName: {
      type: String,
      required: false,
      default: '',
    },
    defaultCode: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      values: {
        name: this.defaultName,
        code: this.defaultCode,
      },
    }
  },

  validations: {
    values: {
      name: {
        required: function (value) {
          return required(value)
        },
      },
    },
  },
}
</script>
