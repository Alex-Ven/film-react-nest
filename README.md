# 🎬 Films — бэкенд онлайн-кинотеатра

> NestJS + PostgreSQL / MongoDB | Гибкая архитектура | Бронирование билетов

Проект Films — это бэкенд для онлайн-сервиса бронирования билетов в кинотеатр.  
Он поддерживает работу с **PostgreSQL** или **MongoDB**, в зависимости от переменной окружения.

## 📋 Возможности

- Получение списка фильмов
- Получение расписания по ID фильма
- Создание фильмов и сеансов
- Бронирование билетов
- Поддержка нескольких драйверов БД
- Автоматическое создание таблиц/коллекций
- Запуск через Docker

---

## 🧩 Архитектура

Проект разработан с использованием гибкой архитектуры:

| Слой | Что используется |
|------|------------------|
| DTO | `FilmDto`, `ScheduleDto`, `OrderDto` |
| Мапперы | `mapFilmToDto`, `mapScheduleToDto` |
| Репозитории | `FilmsRepository`, `OrderRepository` |
| База данных | PostgreSQL (TypeORM) или MongoDB (Mongoose) |
| Контроллеры | `FilmsController`, `OrderController` |
| Сервисы | `FilmsService`, `OrderService` |

---

## 🔧 Установка и запуск

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/Alex-Ven/film-react-nest.git
cd film-react-nest
```

### 2. Установите зависимости

```bash
npm install
```

или через Docker Compose:

```bash
docker-compose up -d
```

---

## 🐳 Запуск через Docker

### A. Настройте `.env`

```env
# .env
DATABASE_DRIVER=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=prac
POSTGRES_PASSWORD=prac
POSTGRES_DATABASE=prac
```

### B. Запустите контейнеры

```bash
docker-compose up -d
```

> Это запустит:
- `film-backend` — ваш NestJS-бэкенд
- `prac-postgres` — PostgreSQL
- `film-mongo` — MongoDB (если включена)

---

## 🔄 Переключение драйвера

Измените значение `DATABASE_DRIVER` в `.env`:

```env
DATABASE_DRIVER=postgres
```

или

```env
DATABASE_DRIVER=mongodb
```

> После этого перезапустите контейнеры:

```bash
docker-compose down
docker-compose up -d
```

---

## 🌐 Доступные API-эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET   | `/api/afisha/films` | Получить список фильмов |
| GET   | `/api/afisha/films/:id/schedule` | Получить расписание для фильма |
| POST  | `/api/afisha/films` | Добавить новый фильм |
| POST  | `/order` | Забронировать билеты |

---

## 📦 Пример запроса: бронирование билета

```json
POST /order HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+79876543210",
  "tickets": [
    {
      "film": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
      "session": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
      "row": 1,
      "seat": 2
    }
  ]
}
```

✅ Ответ:

```json
{
  "total": 1,
  "items": [
    {
      "film": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
      "session": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
      "row": 1,
      "seat": 2,
      "id": "1:2"
    }
  ]
}
```

---

## 🧪 Тестирование через Postman

В папке `postman/` вы найдёте:
- Коллекцию `film.postman.json`
- Переменные среды для тестирования (`test` environment)

---

## 🗂 Структура проекта

```
src/
├── films/
│   ├── dto/
│   │   └── films.dto.ts
│   │   └── films.mapper.ts
│   ├── entities/
│   │   └── film.entity.ts         ← TypeORM
│   │   └── schedule.entity.ts     ← TypeORM
│   │   └── film.mongo-entity.ts   ← Mongoose
│   ├── repository/
│   │   └── films.typeorm-repository.ts
│   │   └── films.mongo-repository.ts
│   │   └── films.repository.interface.ts
│   ├── service/
│   │   └── films.service.ts
│   └── controller/
│       └── films.controller.ts

├── order/
│   ├── dto/
│   │   └── order.dto.ts
│   ├── repository/
│   │   └── order.typeorm-repository.ts
│   │   └── order.mongo-repository.ts
│   │   └── order.repository.interface.ts
│   ├── service/
│   │   └── order.service.ts
│   └── controller/
│       └── order.controller.ts

└── config/
    └── database.module.ts
```

---

## 📁 SQL / Mongoose

Вы можете найти SQL-файлы в папке:

```
test/
├── prac.init.sql
├── prac.films.sql
└── prac.schedules.sql
```

---

## 🛠 Используемые технологии

| Технология | Версия |
|-----------|--------|
| NestJS    | ^10.0.0 |
| TypeORM   | ^0.3.19 |
| PostgreSQL | 16-alpine |
| Mongoose  | ^8.4.4 |
| Node.js   | 20-alpine |
| Docker    | compose v3.8 |

---

## ✅ Требования к тестированию

| Проверка | Ожидаемый результат |
|---------|--------------------|
| Все фильмы доступны | `GET /api/afisha/films` → JSON |
| Расписание не пустое | `GET /api/afisha/films/:id/schedule` → массив сеансов |
| Бронирование работает | `POST /order` → успешный ответ |
| Поддержка PostgreSQL / MongoDB | ✔️ DATABASE_DRIVER=postgres / mongodb |
| DTO и мапперы работают правильно | ✔️ |
| Статика отдаётся через `/public` | ✔️ `/content/afisha` |

---

## 📝 Полезные команды

| Что? | Команда |
|------|--------|
| Запуск через Docker | `docker-compose up -d` |
| Остановка контейнеров | `docker-compose down` |
| Логи бэкенда | `docker logs film-backend` |
| Логи Postgres | `docker logs prac-postgres` |
| Войти в БД | `docker exec -it prac-postgres psql -U prac -d prac` |
| Запустить Postman-тесты | `newman run films.postman.json` |
| Посмотреть данные в MongoDB | `docker exec -it film-mongo mongosh afisha` |

---

## 📌 Лицензия

MIT License — используйте свободно!

---

## 👨‍💻 Автор

Александр Венедюхин  
Yandex.Practicum, курс «Node.js»
