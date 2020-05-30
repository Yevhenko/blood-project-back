FROM node:12-alpine
WORKDIR /index
COPY package*.json ./
RUN npm ci

COPY . .

CMD npm start

EXPOSE 4000
