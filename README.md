<p align="center">
  <a href="https://debauthn.tic.udc.es">
    <img alt="debauthn" src="https://github.com/martinord/debauthn-backend/blob/master/docs/header.png">
  </a>
</p>

<p align="center">
  A WebAuthn Authenticator Debugging Tool
</p>

## Start

Copy the frontend files to `src/public`, generated from [this repository](https://github.com/martinord/debauthn-frontend/).

``` bash
npm install
npm start
```

## Setting up TLS

In production, configure tlsEnabled to `false` in `src/config/server.js`.

For development purposes, you can generate self-signed TLS certificates:

``` bash
mkdir tls
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls/private.key -out tls/certificate.crt
```

## Dependencies: adding functionality
Apply patches to the dependencies for adding functionality:

```bash
npm run postinstall
```
</details>