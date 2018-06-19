FROM node:9-alpine

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000:3000

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app

RUN yarn build
#CMD ["node", "./dist/index"]
