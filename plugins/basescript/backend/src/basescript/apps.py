from django.apps import AppConfig


class PluginNameConfig(AppConfig):
    name = "basescript"

    def ready(self):
        from baserow.core.action.registries import action_type_registry
        from baserow.core.trash.registries import trash_item_type_registry
        from baserow.core.registries import (
            plugin_registry,
            application_type_registry,
            object_scope_type_registry,
            operation_type_registry
        )

        from .plugins import PluginNamePlugin
        from .application_types import ScriptCollectionApplicationType

        application_type_registry.register(ScriptCollectionApplicationType())
        plugin_registry.register(PluginNamePlugin())

        from .script.trash import ScriptTrashableItemType
        trash_item_type_registry.register(ScriptTrashableItemType())

        from .script.actions import CreateScriptActionType, DeleteScriptActionType
        action_type_registry.register(CreateScriptActionType())
        action_type_registry.register(DeleteScriptActionType())

        from .object_scopes import ScriptCollectionObjectScopeType, ScriptObjectScopeType
        object_scope_type_registry.register(ScriptCollectionObjectScopeType())
        object_scope_type_registry.register(ScriptObjectScopeType())

        from .script.trash import RestoreScriptOperationType
        operation_type_registry.register(RestoreScriptOperationType())
