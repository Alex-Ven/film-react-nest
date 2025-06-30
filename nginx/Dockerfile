FROM nginx:alpine

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*

# Копируем статические файлы
COPY ../public /app/public

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf


EXPOSE 80