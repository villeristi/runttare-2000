# ------------------------------------------------------------
# Base layer
# ------------------------------------------------------------
FROM arm32v6/node:16-alpine3.15 as base

# RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache g++ make py3-pip

WORKDIR /usr

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN ls -a
RUN npm install
RUN npm run build


# ------------------------------------------------------------
# Development-stage
# ------------------------------------------------------------
FROM base as development

WORKDIR /usr

COPY package*.json ./
RUN npm install

CMD ["npm","start"]


# ------------------------------------------------------------
# Production-stage
# ------------------------------------------------------------
FROM base as production

WORKDIR /usr

COPY package.json ./

RUN npm install --only=production

COPY --from=base /usr/dist .

# RUN npm install pm2 -g

EXPOSE 80

# CMD ["pm2-runtime","server.js"]
CMD ["npm", "start:prod"]
