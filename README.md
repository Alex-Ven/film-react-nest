# FILM!

Это заготовка для полноценной разработки проекта FILM! с использованием стека React (фронтенд) и Nest.js (бэкенд). Эта ветка (`feat/postgres`) представляет собой миграцию проекта **FILM!** с MongoDB на реляционную базу данных **PostgreSQL**. В проекте теперь используется TypeORM как ORM для работы с базой данных.

## Стек технологий

* **Фронтенд:** React
* **Бэкенд:** Nest.js
* **База данных:** PostgreSQL
* **ORM:** TypeORM

### 1. Модели данных TypeORM

Сущности теперь необходимо описать как TypeORM-сущности с декораторами:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;
}
```

### 2. Настроить работу с TypeORM

В `app.module.ts` добавить конфигурацию TypeORM:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
}),
```

## Установка и запуск

### 1. Настройка базы данных

Создайте базу данных в PostgreSQL:

```sql
CREATE DATABASE practicum;
```

### 2. Установка зависимостей

```bash
cd backend
npm ci
```

### 3. Настройка переменных окружения

Создайте файл `.env` из `.env.example` и настройте подключение к PostgreSQL:

```env
# Database
DATABASE_DRIVER=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=prac
```

### 4. Запуск приложения

```bash
# Development mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

### Проверка работы

После запуска проверьте:
1. Подключение к базе данных
2. Применение миграций
3. Создание тестовых данных
4. Работу основных endpoint'ов API

## Примечания

- Миграция с NoSQL на реляционную БД требует пересмотра структуры данных
- TypeORM предоставляет более строгую типизацию по сравнению с MongoDB