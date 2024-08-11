import { BaserowPlugin } from '@baserow/modules/core/plugins'

export class PluginNamePlugin extends BaserowPlugin {
  static getType() {
    return 'basescript'
  }
}
