FROM node:18-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install --omit=dev
# RUN npm install 

COPY . .

ENV URL_MONGODB=mongodb-srv:27017

ENV PORT=8080

ENV JWT_KEY=somekey 

ENTRYPOINT [ "npm","start" ]