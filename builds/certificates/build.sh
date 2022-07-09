#!/bin/sh
#this is meant to be executed from the root repo dir using npm
echo "I'm in $(pwd)"
echo "Building Self Signed Certificates in src/balek-server/etc/cert"
mkdir -p src/balek-server/etc/cert
openssl genrsa -out src/balek-server/etc/cert/auto-ca.key 4096
openssl req -x509 -new -nodes -key src/balek-server/etc/cert/auto-ca.key -sha256 -days 365 -out src/balek-server/etc/cert/auto-ca.crt -subj "/C=US/ST=Oregon/L=Oregon/O=Private/OU=auto/CN=coopilot"
openssl genrsa -out src/balek-server/etc/cert/auto-server.key 4096
openssl req -new -key src/balek-server/etc/cert/auto-server.key -config builds/certificates/config.cnf -out src/balek-server/etc/cert/auto.csr
