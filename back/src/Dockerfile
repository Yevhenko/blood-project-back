FROM node:12-alpine
WORKDIR /index

COPY package*.json ./

RUN npm ci

COPY . .

CMD npm run db:start && npm start

EXPOSE 3000
