# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- Dev Stage ---
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]
EXPOSE 5173

# --- Build Stage ---
FROM base AS builder
COPY . .
RUN npm run build

# --- Final Stage ---
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Удаляем дефолтные файлы nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx (если нужно)
# COPY ../nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf

# Стандартная команда для nginx
CMD ["nginx", "-g", "daemon off;"]