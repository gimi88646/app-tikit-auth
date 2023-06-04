FROM node:18-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install --omit=dev

COPY . .

ENV PORT=8080

ENTRYPOINT [ "npm","start" ]