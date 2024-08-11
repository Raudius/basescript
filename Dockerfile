FROM baserow/baserow:1.26.1

COPY ./plugins/basescript/ /baserow/plugins/basescript/
RUN /baserow/plugins/install_plugin.sh --folder /baserow/plugins/basescript
