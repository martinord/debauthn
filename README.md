# DebAuthn Backend
__WebAuthn Authenticator Debugging Tool__

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

## Bugs

Applied this PR manually into FIDO2 library: https://github.com/webauthn-open-source/fido2-lib/pull/25