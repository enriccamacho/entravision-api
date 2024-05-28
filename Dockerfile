FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN npm install typescript --save-dev

RUN npm run build

EXPOSE 3000

CMD ["node", "index.js"]
