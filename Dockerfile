# https://dev.to/alex_barashkov/using-docker-for-nodejs-in-development-and-production-3cgp

FROM node:15-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN apk --no-cache add python make g++

COPY package*.json ./
RUN npm install

FROM node:15-alpine

RUN apk add  --no-cache ffmpeg

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

COPY . .

CMD [ "npm", "run", "start:prod" ]
