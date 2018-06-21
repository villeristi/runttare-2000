FROM node:9

ENV NODE_ENV production
ENV PORT 3001
EXPOSE 3001:3001

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN yarn --silent

COPY . /app

RUN yarn build --production
CMD ["node", "./dist/index"]
