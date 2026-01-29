FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
# Updated command to load .env natively
CMD ["node", "--env-file=.env", "server.js"]