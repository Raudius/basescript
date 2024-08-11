from baserow.core.action.registries import action_type_registry
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..script.actions import CreateScriptActionType, DeleteScriptActionType
from ..api.serializers import ScriptSerializer
from ..script.handler import ScriptHandler


# TODO: validate requests

class ScriptsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, collection_id):
        """Lists all the scripts in a collection."""
        scripts = ScriptHandler().get_scripts_for_collection(collection_id)

        serializer = ScriptSerializer(scripts, many=True)
        return Response(serializer.data)

    def post(self, request, collection_id):
        """Creates a new script into the given collection."""
        data = request.data

        code = ""
        if "code" in data:
            code = data["code"]

        collection = ScriptHandler().get_collection(collection_id)
        script = action_type_registry.get_by_type(CreateScriptActionType).do(
            request.user,
            collection,
            data["name"],
            code=code
        )
        serializer = ScriptSerializer(script, many=False)
        return Response(serializer.data)


class ScriptView(APIView):
    def get(self, request, script_id):
        """Retrieves the given script."""
        script = ScriptHandler().get_script(script_id)

        serializer = ScriptSerializer(script, many=False)
        return Response(serializer.data)

    def patch(self, request, script_id):
        data = request.data

        script = ScriptHandler().get_script(script_id)

        if "name" in data:
            script.name = data['name']
        if "code" in data:
            script.code = data['code']

        script.save()

        serializer = ScriptSerializer(script, many=False)
        return Response(serializer.data)

    def delete(selfself, request, script_id):
        script = ScriptHandler().get_script(script_id)
        action_type_registry.get_by_type(DeleteScriptActionType).do(
            request.user,
            script
        )
        return Response(status=204)
