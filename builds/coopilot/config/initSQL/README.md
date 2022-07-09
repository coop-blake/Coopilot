# Coopilot Docker Build Config initSQL Directory
The .sql files in this directory get loaded when the sql container is built

[`000_createDatabases.sql`](000_createDatabases.sql) Creates the default database and user

This file can be modified and more sql files can be added. The containers must be rebuilt to activate changes

You probably have to delete the /Coopilot/builds/coopilot/data/mysqlDB directory to convince the container it hasn't been ran
