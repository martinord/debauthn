<p align="center">
  <a href="https://debauthn.tic.udc.es">
    <img alt="debauthn" src="https://github.com/martinord/debauthn-backend/blob/master/docs/header.png">
  </a>
</p>

<p align="center">
  A WebAuthn Authenticator Debugging Tool
</p>

![GitHub](https://img.shields.io/github/license/martinord/debauthn)
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/martinord/debauthn)
![Docker Pulls](https://img.shields.io/docker/pulls/martinord/debauthn)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/martinord/debauthn)
![GitHub last commit](https://img.shields.io/github/last-commit/martinord/debauthn)
![GitHub last commit](https://img.shields.io/github/last-commit/martinord/debauthn-frontend?label=frontend%20last%20commit)


## Prerequisites

- A MongoDB server: a docker instance or `mongod`.
- A TLS setup. All requests need to use TLS (HTTPS). 
- NodeJS (v10 or v12 recommended).

## Start

There is a deployment script that helps with all steps. Run `./deploy.sh --help` for more information. A MongoDB should be running (check the configuration files at `src/config`).

Then run:

``` bash
./deploy.sh --all
```

## Docker deployment

### Local build

This deployment would deploy with `docker-compose` the MongoDB and DebAuthn. First, review the configuration at `docker-compose.yml`. Then, run:

```bash
./deploy.sh --docker
```

### Public build

You can also use the built image available at [Docker Hub](https://hub.docker.com/r/martinord/debauthn). For deplying, use [this `docker-compose.yml`](https://gist.github.com/martinord/c76bd20a336782b5c9343bb4456703d0) instead.

```bash
git clone https://gist.github.com/c76bd20a336782b5c9343bb4456703d0.git
cd c76bd20a336782b5c9343bb4456703d0/
docker-compose up -d
```

## Setting up TLS

In production, it is recommended to use a server like NGINX with TLS that forwards the petitions to DebAuthn.

For development purposes, you can generate self-signed TLS certificates:

``` bash
mkdir tls
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls/private.key -out tls/certificate.crt
```

Also set `TLS=true` as an environment variable when running the project.

## Dependencies: adding functionality
Apply patches to the dependencies for adding functionality:

```bash
npm run postinstall
```
</details>