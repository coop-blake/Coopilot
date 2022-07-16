# Standalone Build Directory
_This directory is for building standalone modules to be served as a static resource_

Execute this command from repository root:

`docker-compose -f builds/standalone/docker-compose.yml build`


then

`docker-compose -f builds/standalone/docker-compose.yml up`

Then look in [webroot](./webroot) directory for the built widget

