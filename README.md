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

## Bugs and dependencies

#### ArrayBuffer at Assertion Result

This change is intended to fix a bug of the library. It was applied [this PR](https://github.com/webauthn-open-source/fido2-lib/pull/25) manually into FIDO2 library:. See details here:

<details>
<summary>Changes in fido2-lib/lib/parser.js</summary>

```diff
    let ret = new Map([
        ["sig", sigAb],
        ["userHandle", userHandle],
-       ["rawAuthnrData", msg.response.authenticatorData],
+       ["rawAuthnrData", coerceToArrayBuffer(msg.response.authenticatorData, "response.authenticatorData")],
        ...parseAuthenticatorData(msg.response.authenticatorData)
    ]);
```
</details>


#### Reusing options

This change allows to reuse some requested options after doing a post of the result. Both Attestation and Assertion operations. See details here:

<details>
<summary>Changes in fido2-lib/lib/main.js</summary>

```diff
    async assertionResult(res, expected) {
        expected.flags = factorToFlags(expected.factor, []);
-       delete expected.factor;
+       // delete expected.factor;
        return Fido2AssertionResult.create(res, expected);
    }
    
    // ...  //

    async assertionResult(res, expected) {
        expected.flags = factorToFlags(expected.factor, []);
-       delete expected.factor;
+       // delete expected.factor;
        return Fido2AssertionResult.create(res, expected);
    }
```
</details>