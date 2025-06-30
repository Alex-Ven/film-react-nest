FROM nginx:alpine

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*

# Копируем нашу статику из backend/public
COPY backend/public /app/public

COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf


EXPOSE 80