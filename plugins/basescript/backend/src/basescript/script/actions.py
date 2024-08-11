import dataclasses
from baserow.core.action.registries import UndoableActionType, ActionTypeDescription
from django.contrib.auth.models import AbstractUser

from baserow.core.action.scopes import ApplicationActionScopeType
from ..models import ScriptCollection, Script
from ..script.handler import ScriptHandler
from baserow.core.action.models import Action
from baserow.core.action.registries import ActionScopeStr
from baserow.core.trash.handler import TrashHandler

SCRIPT_COLLECTION_ACTION_CONTEXT = ('in script-collection "%(script_collection_name)s" (%(script_collection_id)s).')


class CreateScriptActionType(UndoableActionType):
    type = "create_script"
    description = ActionTypeDescription("Create script", 'Script "%(script_name)s" (%(script_id)s) created')

    @dataclasses.dataclass
    class Params:
        script_collection_id: int
        script_collection_name: str
        script_id: int
        script_name: str

    @classmethod
    def do(cls, user: AbstractUser, collection: ScriptCollection, name: str, code: str="") -> Script:
        script = ScriptHandler().create_script(collection, name, code=code)
        params = cls.Params(
            script_collection_id=collection.id,
            script_collection_name=name,
            script_id=script.id,
            script_name=script.name,
        )

        cls.register_action(user, params, cls.scope(collection.id), workspace=collection.workspace)
        return script


    @classmethod
    def scope(cls, collection_id) -> ActionScopeStr:
        return ApplicationActionScopeType.value(collection_id)

    @classmethod
    def undo(cls, user: AbstractUser, params: Params, action_being_undone: Action):
        script = ScriptHandler().get_script(id=params.script_id)
        ScriptHandler().delete_script(user, script)

    @classmethod
    def redo(cls, user: AbstractUser, params: Params, action_being_redone: Action):
        TrashHandler.restore_item(
            user, "script", params.script_id, parent_trash_item_id=None
        )


class DeleteScriptActionType(UndoableActionType):
    type = "delete_script"
    description = ActionTypeDescription("Delete script", 'Script "%(script_name)s" (%(script_id)s) deleted')

    @dataclasses.dataclass
    class Params:
        script_collection_id: int
        script_collection_name: str
        script_id: int
        script_name: str

    @classmethod
    def do(cls, user: AbstractUser, script: Script):
        collection = script.collection
        params = cls.Params(
            script_collection_id=collection.id,
            script_collection_name=collection.name,
            script_id=script.id,
            script_name=script.name,
        )

        ScriptHandler().delete_script(user, script)

        cls.register_action(user, params, cls.scope(collection.id), workspace=collection.workspace)

    @classmethod
    def scope(cls, collection_id) -> ActionScopeStr:
        return ApplicationActionScopeType.value(collection_id)

    @classmethod
    def undo(cls, user, params, action_being_undone):
        TrashHandler.restore_item(user, "script", params.script_id, parent_trash_item_id=None)