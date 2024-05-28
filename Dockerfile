FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN npm install typescript --save-dev

EXPOSE 3000

CMD ["node", "index.js"]
