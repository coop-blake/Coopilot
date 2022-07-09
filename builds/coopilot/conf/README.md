# Balek Configuration Directory
This directory is used for configuring a Balek Instance.

The [`config.json`](config.json) file in this directory is
loaded at startup. The certificates, used by Balek for https 
and secure websocket connections, are found in the [`cert/`](cert/README.md) subdirectory.

### config.json

**_[Example from Coopilot Docker Build](../../../builds/coopilot/conf/config.json)_**

    {
		"Session Settings": {
			"Main Module": "coopilot/login"
		},
		"Network Settings":{
			"Server Address" : "0.0.0.0",
			"Server Port" : "8080"
		},
		"Database Settings": {
			"MySQL Database Connection": {
				"host": "mysqld-coopilot",
				"user": "balekAppUser",
				"password": "balekAppPassword",
				"database": "balek"
			},
			"Mongo Database Connection": {
				"host": "mongodb-coopilot",
				"port": "27017",
				"user": "root",
				"password": "rootPass",
				"database": "balek"
			}
		}
	}


### SSL Certificate
`src/balek-server/etc/cert/cert.pem`

### SSL Private Key
`src/balek-server/etc/cert/key.pem`
