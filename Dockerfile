FROM node:9.11.1-alpine

WORKDIR /usr/app/organizer-backend

COPY package.json .
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python && \
    npm install --quiet -g node-gyp node-pre-gyp gulp && \
    npm install --quiet && \
    npm rebuild bcrypt --build-from-source && \
    apk del native-deps

COPY . .
