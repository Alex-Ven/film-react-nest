FROM nginx:alpine

# Очистим стандартный html
RUN rm -rf /usr/share/nginx/html/*



COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf


EXPOSE 80