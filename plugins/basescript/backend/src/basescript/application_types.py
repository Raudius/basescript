from baserow.core.registries import ApplicationType

from .api.serializers import ScriptCollectionSerializer
from .models import ScriptCollection
from .script.handler import ScriptHandler


class ScriptCollectionApplicationType(ApplicationType):
    type = 'script-collection'
    model_class = ScriptCollection
    instance_serializer_class = ScriptCollectionSerializer
    serializer_mixins = [ScriptCollectionSerializer]
    serializer_field_names = ["scripts"]

    def enhance_queryset(self, queryset):
        return queryset.prefetch_related("scripts")

    def init_application(self, user, application) -> None:
        init_script_name = 'Hello world!'
        init_script_code = """
await io.text("Hello world!")

// Now you can write small programs which interact with your workspace.
// Try fiddling with the following code and see what happens...

// const base = await getBase({ name: 'MyBase' })
// const table = await base.getTable({ name: 'MyTable })
// const queryResult = await table.select()
// await io.table(queryResult)
"""
        ScriptHandler().create_script(application, init_script_name, init_script_code)
