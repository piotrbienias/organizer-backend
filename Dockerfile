FROM node:9.11.1-alpine

WORKDIR /usr/app/organizer-backend

COPY package.json .
RUN npm install -g npm
RUN npm install --quiet -g gulp && \
    npm install --quiet --force

COPY . .
