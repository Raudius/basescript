FROM baserow/backend:1.26.1

USER root

COPY ./plugins/basescript/ $BASEROW_PLUGIN_DIR/basescript/
RUN /baserow/plugins/install_plugin.sh --folder $BASEROW_PLUGIN_DIR/basescript

USER $UID:$GID
