import { ApplicationType } from '@baserow/modules/core/applicationTypes'
import Sidebar from '@basescript/components/sidebar/Sidebar.vue'

export class ScriptCollectionApplicationType extends ApplicationType {
  static getType() {
    return 'script-collection'
  }

  getIconClass() {
    return 'iconoir-cpu'
  }

  getName() {
    return 'Script collection'
  }

  getRouteName() {
    return 'script-collection'
  }

  getSidebarComponent() {
    return Sidebar
  }

  select(application, { $router, $store }) {
    const scripts = application.scripts ?? []

    if (scripts.length === 0) {
      $store.dispatch('toast/error', {
        title: 'Could not select the application',
        message: "The script collection couldn't be selected because it doesn't have any scripts. Use the sidebar to create one.",
      })
      return false
    }

    $router.push({
      name: 'basescript',
      params: {
        scriptId: scripts[0].id,
        collectionId: application.id,
      },
    })
  }
}
