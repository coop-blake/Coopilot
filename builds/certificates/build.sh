#!/bin/sh
#this is meant to be executed from the root repo dir using npm
echo "I'm in $(pwd)"
echo "Building Self Signed Certificates in $(pwd)/autogenCerts"
mkdir autogenCerts
openssl genrsa -out autogenCerts/auto-ca.key 4096
openssl req -x509 -new -nodes -key autogenCerts/auto-ca.key -sha256 -days 365 -out autogenCerts/auto-ca.crt -subj "/C=US/ST=Oregon/L=Oregon/O=Private/OU=auto/CN=coopilot"
#openssl genrsa -out autogenCerts/auto-server.key 4096
#openssl req -new -key autogenCerts/auto-server.key -config autogenCertConfig.cnf -out autogenCerts/auto.csr
