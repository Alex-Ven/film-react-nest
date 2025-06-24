# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps curl \
    && curl -fsSL https://downloads.mongodb.com/compass/mongosh-2.0.1-linux-x64.tgz | tar -xz -C /usr/local/bin --strip-components=1 \
    && apk del .build-deps

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Создаем директорию для логов
RUN mkdir -p /app/logs && chown 777 /app/logs

# Переключаемся на непривилегированного пользователя
#USER node

EXPOSE 3000

CMD ["npm", "run", "start:dev"]