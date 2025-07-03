FROM nginx:alpine

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*

# Копируем медиа в нужную структуру
COPY backend/public/content/afisha /app/public/content/afisha

COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf


EXPOSE 80