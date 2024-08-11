from baserow.core.trash.handler import TrashHandler
from django.db import transaction

from ..models import Script, ScriptCollection


class ScriptHandler:
    def get_collection(self, id: int):
        return ScriptCollection.objects.get(id=id)

    def get_script(self, id: int) -> Script:
        # TODO map errors
        return Script.objects.get(id=id)

    def get_scripts_for_collection(self, collection: ScriptCollection) -> Script:
        # TODO map errors
        return Script.objects.filter(collection=collection)

    @transaction.atomic
    def create_script(
            self,
            collection: ScriptCollection,
            name: str,
            code: str = ""
    ) -> Script:
        # TODO map errors
        script = Script.objects.create(collection=collection, name=name, code=code)
        return script

    def delete_script(self, user, script: Script):
        TrashHandler.trash(user, script.collection.workspace, script.collection, script)
