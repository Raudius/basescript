from rest_framework import serializers
from ..models import Script, ScriptCollection


class ScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Script
        fields = ("id", "name", "code")
        extra_kwargs = {
            "id": {"read_only": True}
        }



class ScriptCollectionSerializer(serializers.ModelSerializer):
    scripts = serializers.SerializerMethodField(
        help_text="This field is specific to the `script-collection` application and contains "
        "an array of scripts that are in the collection."
    )

    class Meta:
        model = ScriptCollection
        fields = ("id", "name", "scripts")

    def get_scripts(self, instance: Script):
        scripts = []
        if hasattr(instance, "scripts"):
            scripts = instance.scripts.all()

        return ScriptSerializer(scripts, many=True).data