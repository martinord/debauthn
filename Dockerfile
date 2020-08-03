FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN ./deploy.sh --install
RUN ./deploy.sh --front
RUN rm -rf debauthn-frontend/ docs/
EXPOSE 5000
CMD ["./deploy.sh","--server"]