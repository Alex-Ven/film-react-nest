FROM nginx:alpine

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*

RUN mkdir -p /app/public/content/afisha

COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf


EXPOSE 80