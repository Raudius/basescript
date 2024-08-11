from django.urls import re_path
from .views import ScriptView, ScriptsView

app_name = "basescript.api"

urlpatterns = [
    re_path(r"collection/(?P<collection_id>[0-9]+)/$", ScriptsView.as_view(), name="list"),
    re_path(r"script/(?P<script_id>[0-9]+)/$", ScriptView.as_view(), name="item"),
]
