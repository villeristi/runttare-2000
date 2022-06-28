# ------------------------------------------------------------
# Base layer
# ------------------------------------------------------------
FROM arm32v7/node:16-alpine3.15 as base

LABEL maintainer="Wille <villeristimaki@gmail.com>"

WORKDIR /usr/src/app

RUN apk --no-cache add g++ make libpng-dev

COPY package*.json ./

RUN npm i

COPY . ./

ARG API_URL
ARG BROKER_URL

ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_BROKER_URL=$BROKER_URL

RUN npm run build


# ------------------------------------------------------------
# Development-stage
# ------------------------------------------------------------
FROM base as development

WORKDIR /usr/src/app

RUN npm i

CMD npm start

# ------------------------------------------------------------
# Production-stage - nginx-proxy
# ------------------------------------------------------------
FROM arm32v7/nginx:1.21.6-alpine as production
# FROM nginx:1.21.6-alpine as production

RUN addgroup --system node_app \
    && adduser --system --ingroup node_app node_app

COPY --chown=node_app:node_app --from=base /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
