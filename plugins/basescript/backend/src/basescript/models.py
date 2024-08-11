from baserow.core.models import Application
from baserow.core.mixins import CreatedAndUpdatedOnMixin, TrashableModelMixin, HierarchicalModelMixin
from django.db import models


class ScriptCollection(Application):
    pass


class Script(CreatedAndUpdatedOnMixin, TrashableModelMixin, HierarchicalModelMixin, models.Model):
    collection = models.ForeignKey(ScriptCollection, related_name="scripts", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.TextField(default="")

    def get_parent(self):
        return self.collection
