# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# 🔁 Копируем необходимые src-файлы для TypeORM CLI
COPY --from=builder /app/src/typeorm.config.ts ./src/typeorm.config.ts
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/**/*.entity.ts ./src/
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["node", "dist/main"]