<template>
  <div>
    <SidebarApplication
      ref="sidebarApplication"
      :application="application"
      :workspace="workspace"
      @selected="selected"
    >
      <template v-if="isAppSelected(application)" #body>
        <ul class="tree__subs">
          <SidebarItem
            v-for="script in scripts"
            :key="script.id"
            :script="script"
            :collection="application"
            @editScript="editScript(script)"
          ></SidebarItem>
        </ul>

        <a class="tree__sub-add" @click="newScript()">
          <i class="tree__sub-add-icon iconoir-plus"></i>
          Create script
        </a>
      </template>
    </SidebarApplication>
    <EditScriptModal ref="editScriptModal" :script="this.editingScript" :collection="application" />
  </div>
</template>

<script>
import EditScriptModal from '@basescript/components/modals/EditScriptModal'
import SidebarItem from '@basescript/components/sidebar/SidebarItem'

import SidebarApplication from '@baserow/modules/core/components/sidebar/SidebarApplication'
import { notifyIf } from '@baserow/modules/core/utils/error'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  components: { SidebarApplication, SidebarItem, EditScriptModal },
  props: {
    application: {
      type: Object,
      required: true,
    },
    workspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editingScript: null,
    }
  },
  computed: {
    scripts() {
      return this.application.scripts
    },
    ...mapGetters({ isAppSelected: 'application/isSelected' }),
  },
  methods: {
    async selected(application) {
      try {
        await this.$store.dispatch('application/select', application)
      } catch (error) {
        notifyIf(error, 'workspace')
      }
    },
    editScript(script) {
      this.editingScript = script
      this.$refs.editScriptModal.show()
      const context = this?.$refs?.sidebarApplication?.$refs?.context ?? null
      context && context.hide()
    },
    newScript() {
      this.editScript(null)
    },
  },
}
</script>
