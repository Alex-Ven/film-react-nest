# --- Build Stage ---
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Final Stage ---
FROM alpine:3.18

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

# Добавляем пустую директорию для volume (будет перезаписана в compose)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80