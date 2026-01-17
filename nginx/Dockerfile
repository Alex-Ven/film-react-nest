FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Создаем нужную структуру
RUN mkdir -p /app/public/content/afisha/

# Копируем медиафайлы
COPY backend/public/content/afisha /app/public/content/afisha/

# Копируем конфиг Nginx
COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
