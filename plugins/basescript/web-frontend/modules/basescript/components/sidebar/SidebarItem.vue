<template>
  <li class="tree__sub" :class="{ active: false }">
    <a
      class="tree__sub-link"
      :class="{ 'tree__sub-link--empty': script.name === '' }"
      :title="script.name"
      :href="resolveTableHref(script)"
      @mousedown.prevent
      @click.prevent="selectScript(script)"
    >
      {{ script.name }}
    </a>

    <a
      class="tree__options"
      @click="$refs.context.toggle($event.currentTarget, 'bottom', 'right', 0)"
      @mousedown.stop
    >
      <i class="baserow-icon-more-vertical"></i>
    </a>

    <Context
      ref="context"
      :overflow-scroll="true"
      :max-height-if-outside-viewport="true"
    >
      <div class="context__menu-title">{{ script.name }} ({{ script.id }})</div>
      <ul class="context__menu">
        <li class="context__menu-item">
          <a class="context__menu-item-link" @click="editScript()">
            <i class="context__menu-icon iconoir-code"></i>
            Edit script
          </a>
        </li>

        <li class="context__menu-item">
          <a
            class="context__menu-item-link context__menu-item-link--delete"
            :class="{ 'context__menu-item-link--loading': deleteLoading }"
            @click="deleteScript()"
          >
            <i class="context__menu-item-icon iconoir-bin"></i>
            Delete
          </a>
        </li>
      </ul>
    </Context>
  </li>
</template>

<script>
export default {
  name: 'SidebarItem',
  components: {},
  props: {
    collection: {
      type: Object,
      required: true,
    },
    script: {
      type: Object,
      required: true,
    },
  },
  emits: ['editScript'],
  data() {
    return {
      deleteLoading: false,
    }
  },
  computed: {},
  methods: {
    route() {
      return {
        name: 'basescript',
        params: {
          scriptId: this.script.id,
          collectionId: this.collection.id,
        },
      }
    },
    async selectScript() {
      try {
        await this.$nuxt.$router.push(this.route())
      } catch (error) {
        // TODO: propagate if error is not redundant navigation error
      }
    },
    resolveTableHref() {
      return this.$nuxt.$router.resolve(this.route()).href
    },
    editScript() {
      const context = this?.$refs?.context ?? null
      context && context.hide()
      this.$emit('editScript')
    },
    async deleteScript() {
      this.deleteLoading = true
      await this.$store.dispatch('script/delete', {
        script: this.script,
        collection: this.collection,
      })
      await new Promise((resolve) => setTimeout(() => resolve('Value X'), 2500))

      this.deleteLoading = false
    },
  },
}
</script>
