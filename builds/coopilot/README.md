# Coopilot Docker Build Directory
_This directory contains the configuration needed to run Coopilot in a Docker Container. It also includes configuration for the required Mongo and SQL databases_


## Configuration
### Coopilot
The [`conf/`](conf/) directory contains the configuration for the Coopilot instance and is a local directory that can be modified to change the behaviour of the container when it is ran.
### Mongo
The mongo container is configured using environment variables passed through the [`docker-compose.yml`](docker-compose.yml) file

The [`data/mongoDB`](data/mongoDB) is the shared with the Mongo Docker Container

### SQL
The SQL container is configured using environment variables passed through the [`docker-compose.yml`](docker-compose.yml) file

It is also initially set up using the [`config/initSQL`](config/initSQL) directory

The [`data/mysqlDB`](data/mysqlDB) is shared with the SQL Docker Container
