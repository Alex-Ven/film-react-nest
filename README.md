# 🎬 Афиша Фильмов (Film Afisha) [Dockerized]

Проект представляет собой полноценное докеризованное приложение для управления афишей кинотеатра с поддержкой двух СУБД:

## 🌐 Продакшн-домен
Приложение доступно по HTTPS:  
🔐 [https://afisha.justforstudy.nomorepartiessbs.ru](https://afisha.justforstudy.nomorepartiessbs.ru)

### Особенности домена:
- Автоматическое перенаправление HTTP → HTTPS
- Сертификаты Let's Encrypt (автообновление)
- Настроены security headers в Nginx
- Поддомены:
  - `api.afisha.justforstudy.nomorepartiessbs.ru` - API бэкенда
  - `pgadmin.afisha.justforstudy.nomorepartiessbs.ru` - Администрирование PostgreSQL

## �ъ️ Архитектура
- **Frontend**: Vite + React (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Базы данных**:
  - PostgreSQL (основная)
  - MongoDB (альтернативная)
- **Инфраструктура**:
  - Nginx (reverse proxy + статика)
  - Docker Compose (оркестрация)
  - GitHub Actions (CI/CD)


### Поддержка MongoDB
- Полная инициализация через `init-mongo.js`
- Автоматическое создание коллекций при первом запуске
- Скрипт миграции данных (`/docker-entrypoint-initdb.d/init-mongo.js`)

### Улучшения Docker:
- Мульти-архитектурные сборки (linux/amd64, linux/arm64)
- Оптимизированные образы через multi-stage build

### CI/CD:
- Автоматическая публикация образов в GHCR
- Проверка целостности данных перед сборкой
- Поддержка тегов `latest` и `git-SHA`

## 🐘 Реализация PostgreSQL

### Конфигурация в docker-compose.prod.yml
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DATABASE}
  volumes:
    - pgdata:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
  networks:
    - app-network
```

### Ключевые особенности:
1. **Миграции**:
   - Используется TypeORM для управления схемой БД
   - Миграции выполняются автоматически при старте бэкенда:
     ```typescript
     TypeOrmModule.forRootAsync({
       useFactory: () => ({
         migrationsRun: true,
         migrations: [join(__dirname, '../migrations/*{.ts,.js}')]
       })
     })
     ```

2. **Данные**:
   - Пример seed-данных (из миграции):
     ```sql
     INSERT INTO films (title, director, rating) VALUES
     ('Архитекторы общества', 'Итан Райт', 2.9),
     ('Недостижимая утопия', 'Харрисон Рид', 9.0);
     ```

3. **Резервное копирование**:
   - Данные сохраняются в Docker volume `pgdata`
   - Ручное создание дампа:
     ```bash
     docker compose exec postgres pg_dump -U prac prac > backup.sql
     ```

4. **Администрирование**:
   - PGAdmin доступен по адресу: `https://pgadmin.afisha.justforstudy.nomorepartiessbs.ru`
   - Данные для входа:
     ```
     Email: admin@example.com
     Password: admin
     ```

## 🚀 Быстрый старт

### 1. Клонирование и настройка
```bash
git clone https://github.com/Alex-Ven/film-react-nest.git  
cd film-react-nest
cp .env.example .env.production
```

### 2. Запуск с MongoDB
```bash
docker compose -f docker-compose.prod.yml --profile mongo up -d --build
```

### 3. Проверка работы
```bash
# Проверить инициализацию данных
docker compose -f docker-compose.prod.yml exec mongo mongosh afisha --eval "db.films.countDocuments()"

# Логи MongoDB
docker compose -f docker-compose.prod.yml logs mongo | grep -i "init"
```

## 🌐 Доступ к сервисам
| Сервис | URL | Порт |
|--------|-----|------|
| Frontend | http://localhost | 80 |
| Backend API | http://localhost/api | 3000 |
| MongoDB | mongodb://localhost:27017 | 27017 |

## 🛠 Важные команды

### Инициализация данных
```bash
# Принудительный запуск скрипта
docker compose -f docker-compose.prod.yml exec mongo mongosh afisha --eval "load('/docker-entrypoint-initdb.d/init-mongo.js')"
```

### Пересборка
```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow особенности:
1. **Сборка образов**:
   - Мульти-архитектурные сборки (amd64/arm64)
   - Кэширование слоев для ускорения сборки

2. **Публикация**:
   ```yaml
   - name: Сборка backend
     uses: docker/build-push-action@v5
     with:
       tags: |
         ghcr.io/alex-ven/film-backend:latest
         ghcr.io/alex-ven/film-backend:${{ github.sha }}
   ```

3. **Проверки**:
   - Валидация наличия медиафайлов перед сборкой
   - Проверка целостности зависимостей

## 🛠️ Инфраструктура Nginx

### Конфигурация для домена:
```nginx
server {
    listen 443 ssl;
    server_name afisha.justforstudy.nomorepartiessbs.ru;

    ssl_certificate /etc/letsencrypt/live/afisha.justforstudy.nomorepartiessbs.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/afisha.justforstudy.nomorepartiessbs.ru/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
    }
}
```

### Особенности:
- HTTP/2 поддержка
- Оптимизированные SSL-настройки
- Кэширование статических ресурсов
- Разделение API и фронтенда

## 🔧 Структура проекта (ключевые файлы)
```
film-react-nest/
├── docker-compose.prod.yml    # Продакшн конфигурация
├── Dockerfile.mongo           # Кастомный образ MongoDB
├── docker-entrypoint-initdb.d/
│   └── init-mongo.js          # Скрипт инициализации
├── .github/workflows/         # CI/CD pipelines
└── ...
```

## 🛡️ Особенности реализации
- **Инициализация MongoDB**:
  - Скрипт выполняется при первом запуске
  - Проверка существующих данных перед вставкой
  - Поддержка всех необходимых коллекций

- **Безопасность**:
  - Изолированные Docker сети
  - Правильные права на файлы (chmod 644)
  - Healthcheck для всех сервисов

## 📊 Мониторинг PostgreSQL

Доступные метрики:
```sql
-- Активные подключения
SELECT count(*) FROM pg_stat_activity;

-- Размер БД
SELECT pg_size_pretty(pg_database_size('prac'));
```

## 🔐 Безопасность

1. **PostgreSQL**:
   - Ограниченный доступ только из внутренней сети Docker
   - SSL-шифрование соединений
   - Регулярное обновление образов

2. **Nginx**:
   - Security headers (CSP, X-XSS-Protection)
   - Ограничение методов HTTP
   - Защита от DDoS

## 🚀 Развертывание на сервере

1. **Настройка домена**:
   ```bash
   certbot --nginx -d afisha.justforstudy.nomorepartiessbs.ru
   ```

2. **Запуск в продакшн**:
   ```bash
   docker compose -f docker-compose.prod.yml --profile postgres up -d
   ```

3. **Проверка**:
   ```bash
   curl -I https://afisha.justforstudy.nomorepartiessbs.ru
   ```

## 📈 Дальнейшее развитие
- [ ] Автоматические тесты в CI
- [ ] Мониторинг через Prometheus
- [ ] Резервное копирование БД
```
