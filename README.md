# Backend for WebAuthn debugging tool

## Start

Copy the frontend files to `src/public`.

``` bash
npm install
npm start
```

## Setting up TLS
Use only for development purposes

``` bash
mkdir tls
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls/private.key -out tls/certificate.crt
```
