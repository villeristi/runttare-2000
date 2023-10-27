ARG BASE_IMG=arm32v7/node:18-alpine3.17
ARG BASE_IMG_PROXY=arm32v7/nginx:1.21.6-alpine


# base ------------------------------
FROM $BASE_IMG AS base

LABEL maintainer="Wille <villeristimaki@gmail.com>"

WORKDIR /usr/src/app

RUN apk --no-cache add g++ make libpng-dev

COPY package*.json ./

RUN npm i

COPY . ./

ARG BROKER_URL

ENV REACT_APP_BROKER_URL=$BROKER_URL

RUN npm run build


# dev ------------------------------
FROM base AS development

WORKDIR /usr/src/app

RUN npm i

CMD npm start


# production - nginx-proxy ---------
FROM $BASE_IMG_PROXY as production

RUN addgroup --system node_app \
    && adduser --system --ingroup node_app node_app

COPY --chown=node_app:node_app --from=base /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
