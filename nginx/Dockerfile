FROM nginx:alpine

# Очистка стандартного html
RUN rm -rf /usr/share/nginx/html/*

# Создаем нужную структуру
RUN mkdir -p /app/public/content/afisha/

# Копируем медиафайлы
COPY backend/public/content/afisha /app/public/content/afisha/

# Копируем конфиг
COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80