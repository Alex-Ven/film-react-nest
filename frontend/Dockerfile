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
EXPOSE 80

# --- Preview Stage ---
FROM base AS preview

COPY . .
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
EXPOSE 4173

# --- Final Stage ---
FROM alpine:3.18

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

# Добавляем пустую директорию для volume (будет перезаписана в compose)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80