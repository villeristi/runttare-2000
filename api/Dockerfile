FROM node:9-alpine

ENV NODE_ENV production
ENV PORT 3001
EXPOSE 3001:3001

RUN mkdir -p /app
WORKDIR /app

RUN rm -rf node_modules

COPY package.json /app/package.json

RUN yarn --silent

COPY . /app

RUN yarn build --production
CMD ["node", "./dist/index"]
