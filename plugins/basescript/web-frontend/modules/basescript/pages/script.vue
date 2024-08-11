<template>
  <div>
    <header ref="header" class="layout__col-2-1 header">
      <ul class="header__filter">
        <li class="header__filter-item">
          <span class="header__filter-basic_content">{{ script.name }}</span>
        </li>
        <li v-if="loading" class="header__filter-item">
          <a class="header__filter-link" @click="$refs.runtimeComponent.stopExecution()">
            <i
              class="header__filter-icon header-filter-icon--view iconoir-square"
            ></i>
            <span class="header__filter-name header__filter-name--forced">
              Stop
            </span>
          </a>
        </li>
        <li class="header__filter-item">
          <a
            class="header__filter-link"
            :class="{ 'header__filter-link--disabled': loading }"
            @click="runScript"
          >
            <i
              v-if="loading"
              class="header__filter-icon header-filter-icon--view loading"
            ></i>
            <i
              v-else
              class="header__filter-icon header-filter-icon--view iconoir-play"
            ></i>
            <span class="header__filter-name header__filter-name--forced">
              {{ loading ? 'Running...' : 'Run' }}
            </span>
          </a>
        </li>
      </ul>
    </header>
    <div class="layout__col-2-2 content">
      <BasescriptRuntime
        ref="runtimeComponent"
        :collection="collection"
        @exit="scriptStopped"
      />
    </div>
  </div>
</template>

<script>
import BasescriptRuntime from '@basescript/components/runtime/BasescriptRuntime.vue'

export default {
  components: { BasescriptRuntime },
  layout: 'app',
  async asyncData({ store, params, error, app, redirect, route }) {
    const collectionId = parseInt(params.collectionId)
    const scriptId = parseInt(params.scriptId)

    const { collection, script } = await store.dispatch('script/selectById', {
      collectionId,
      scriptId,
    })
    return {
      collection,
      script,
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    runScript() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$refs.runtimeComponent.runScript(this.script.code)
    },
    scriptStopped() {
      this.loading = false
    },
  },
}
</script>

<style scoped>
.header__filter-basic_content {
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 100%;
  white-space: nowrap;
}
</style>
