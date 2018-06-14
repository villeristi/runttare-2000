FROM node:9-alpine

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000:3000

RUN yarn global add webpack@3.6.0
RUN yarn global add webpack-merge

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN rm -rf node_modules

RUN yarn

RUN yarn build
#CMD ["node", "./dist/index"]
