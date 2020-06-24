<p align="center">
  <a href="https://debauthn.tic.udc.es">
    <img alt="debauthn" src="https://github.com/martinord/debauthn-backend/blob/master/docs/header.png">
  </a>
</p>

<p align="center">
  A WebAuthn Authenticator Debugging Tool
</p>


## Prerequisites

- A MongoDB server: a docker instance or `mongod`.
- A TLS setup. All requests need to use TLS (HTTPS). 
- NodeJS (v10 or v12 recommended).

## Start

There is a deployment script that helps with all steps. Run `./deploy.sh --help` for more information.

Then run:

``` bash
./deploy.sh --all
```

## Setting up TLS

In production, it is recommended to use a server like NGINX with TLS that forwards the petitions to DebAuthn. For doing this, configure tlsEnabled to `false` in `src/config/server.js`.

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