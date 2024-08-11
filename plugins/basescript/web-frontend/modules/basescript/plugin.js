import { PluginNamePlugin } from '@basescript/plugins'
import { ScriptCollectionApplicationType } from '@basescript/applicationTypes'

import scriptStore from '@basescript/store/script'
export default (context) => {
  const { store, app } = context
  app.$registry.register('plugin', new PluginNamePlugin(context))
  app.$registry.register(
    'application',
    new ScriptCollectionApplicationType(context)
  )

  store.registerModule('script', scriptStore)
}
