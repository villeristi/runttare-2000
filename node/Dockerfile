# ------------------------------------------------------------
# Base layer
# ------------------------------------------------------------
# FROM arm32v7/node:16-alpine3.15 as base
# FROM node:11.15.0-alpine as base
# FROM balenalib/raspberrypi3-node:16 as base
FROM node:16.14-alpine as base

# RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache g++ make py3-pip
# RUN apt-get update && apt-get install -yq \
#     alsa-utils libasound2-dev build-essential python3-dev && \
#    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY . ./

RUN npm install

RUN npm run build


# ------------------------------------------------------------
# Development-stage
# ------------------------------------------------------------
FROM base as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

CMD npm start


# ------------------------------------------------------------
# Production-stage
# ------------------------------------------------------------
FROM base as production

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY --from=base /usr/src/app/dist .

RUN npm install pm2@latest -g

EXPOSE 8000

CMD ["pm2-runtime", "./dist/server.js"]
