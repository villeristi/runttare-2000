FROM node:9

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000:3000

RUN mkdir -p /app/dist
WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app
