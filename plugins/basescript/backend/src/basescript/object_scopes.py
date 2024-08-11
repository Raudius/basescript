from django.db.models import Q
from baserow.core.registries import ObjectScopeType, object_scope_type_registry
from baserow.core.object_scopes import (
    ApplicationObjectScopeType,
    WorkspaceObjectScopeType,
)
from .models import ScriptCollection, Script


class ScriptCollectionObjectScopeType(ObjectScopeType):
    type = "script_collection"
    model_class = ScriptCollection

    def get_parent_scope(self):
        return object_scope_type_registry.get("application")

    def get_enhanced_queryset(self):
        return self.get_base_queryset().prefetch_related("workspace")

    def get_filter_for_scope_type(self, scope_type, scopes):
        if scope_type.type == WorkspaceObjectScopeType.type:
            return Q(workspace__in=[s.id for s in scopes])
        if scope_type.type == ApplicationObjectScopeType.type:
            return Q(id__in=[s.id for s in scopes])

        raise TypeError("The given type is not handled.")


class ScriptObjectScopeType(ObjectScopeType):
    type = "basescript_script"
    model_class = Script

    def get_parent_scope(self):
        return object_scope_type_registry.get("script_collection")

    def get_enhanced_queryset(self):
        return self.get_base_queryset().prefetch_related(
            "script_collection", "database__workspace"
        )

    def get_filter_for_scope_type(self, scope_type, scopes):
        if scope_type.type == WorkspaceObjectScopeType.type:
            return Q(database__workspace__in=[s.id for s in scopes])

        if (
            scope_type.type == ScriptCollectionObjectScopeType.type
            or scope_type.type == ApplicationObjectScopeType.type
        ):
            return Q(database__in=[s.id for s in scopes])

        raise TypeError("The given type is not handled.")
