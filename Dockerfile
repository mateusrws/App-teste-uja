# syntax=docker/dockerfile:1

FROM node:latest
WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]

EXPOSE 5002