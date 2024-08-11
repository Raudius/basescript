from abc import ABC, ABCMeta
from typing import Any, Dict

from baserow.core.registries import OperationType
from baserow.core.trash.registries import TrashableItemType

from ..models import Script


class BasescriptOperation(OperationType, metaclass=ABCMeta):
    context_scope_name = "basescript"


class ScriptOperationType(BasescriptOperation, ABC):
    context_scope_name = "basescript_script"


class RestoreScriptOperationType(ScriptOperationType):
    type = "basescript.script.restore"


class ScriptTrashableItemType(TrashableItemType):
    type = "script"
    model_class = Script

    def get_parent(self, trashed_item):
        return trashed_item.collection

    def get_name(self, trashed_item):
        return trashed_item.name

    def get_restore_operation_type(self) -> str:
        return RestoreScriptOperationType.type

    def permanently_delete_item(
        self,
        trashed_item: Any,
        trash_item_lookup_cache: Dict[str, Any] = None,
    ):
        pass  # TODO implement

    def restore(self, trashed_item, trash_entry):
        super().restore(trashed_item, trash_entry)
