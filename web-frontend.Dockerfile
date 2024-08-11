FROM baserow/web-frontend:1.26.1

USER root

COPY ./plugins/basescript/ /baserow/plugins/basescript/
RUN /baserow/plugins/install_plugin.sh --folder /baserow/plugins/basescript

USER $UID:$GID
