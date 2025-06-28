FROM nginx:alpine

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*

EXPOSE 80