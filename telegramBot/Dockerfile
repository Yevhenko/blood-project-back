# FROM node:12-alpine3.10
# WORKDIR /usr/src/app
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm ci
# COPY . .
# EXPOSE 4000
# CMD node index.js

FROM node:12-alpine
WORKDIR /index
COPY package*.json ./
# COPY package-lock.json ./
RUN npm ci

# COPY telegramBot/ telegramBot/

COPY . .

CMD npm start

EXPOSE 4000
