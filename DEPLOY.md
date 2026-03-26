# Инструкция по деплою на Vercel

## Шаг 1: Подготовка базы данных PostgreSQL

Vercel не поддерживает SQLite в production, поэтому нужно использовать PostgreSQL.

### Вариант A: Vercel Postgres (рекомендуется)
1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в раздел **Storage** → **Create Database**
3. Выберите **Vercel Postgres**
4. Создайте базу данных и получите connection string

### Вариант B: Сторонний PostgreSQL провайдер
- [Neon](https://neon.tech/) — бесплатный тариф доступен
- [Supabase](https://supabase.com/) — бесплатный PostgreSQL
- [Railway](https://railway.app/) — PostgreSQL с бесплатным тарифом

Получите connection string в формате:
```
postgresql://user:password@host:5432/database?schema=public
```

---

## Шаг 2: Загрузите проект на GitHub

```bash
cd I:\proqwen\comps\pc-repair-oct

# Инициализация git (если ещё не инициализирован)
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и добавьте remote
git remote add origin https://github.com/your-username/pc-repair-oct.git
git branch -M main
git push -u origin main
```

---

## Шаг 3: Подключите проект к Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите **Add New Project**
3. Выберите **Import Git Repository**
4. Выберите ваш репозиторий `pc-repair-oct`
5. Нажмите **Import**

---

## Шаг 4: Настройте переменные окружения

В панели Vercel перейдите в **Settings** → **Environment Variables** и добавьте:

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `NEXTAUTH_SECRET` | Секретный ключ (мин. 32 символа) |
| `NEXTAUTH_URL` | URL вашего сайта (например, `https://pc-repair-oct.vercel.app`) |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота |
| `TELEGRAM_ADMIN_ID` | ID администратора в Telegram |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL сайта |

### Как получить NEXTAUTH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Шаг 5: Примените миграции базы данных

После первого деплоя нужно создать таблицы в базе данных.

### Вариант A: Через Vercel CLI (рекомендуется)
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Примените миграции
vercel env pull .env.production.local
npx prisma migrate deploy --prod
```

### Вариант B: Через GitHub Actions (автоматически)
Создайте файл `.github/workflows/prisma-migrate.yml`:
```yaml
name: Prisma Migrate

on:
  push:
    branches:
      - main

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Вариант C: Локально с production URL
```bash
# Получите DATABASE_URL из Vercel
vercel env pull .env.production.local

# Примените миграции
npx prisma migrate deploy --prod
```

---

## Шаг 6: Заполните начальными данными (опционально)

```bash
npm run seed
```

Или через Vercel CLI:
```bash
vercel env pull .env.production.local
npm run seed
```

---

## Шаг 7: Проверьте деплой

1. Откройте ваш сайт на Vercel (например, `https://pc-repair-oct.vercel.app`)
2. Проверьте главную страницу
3. Зайдите в админ-панель: `/admin/login`
4. Проверьте разделы **Финансы** и **Заявки**

---

## Настройка домена (опционально)

1. В Vercel перейдите в **Settings** → **Domains**
2. Добавьте ваш домен (например, `techmaster-okt.ru`)
3. Настройте DNS записи у регистратора домена:
   - **A record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com` (для поддоменов)

---

## Передеплой проекта

При каждом пуше в ветку `main` Vercel автоматически передеплоит проект.

Для ручного передеплоя:
```bash
vercel --prod
```

---

## Локальная разработка с PostgreSQL

Для локальной разработки с той же базой данных:

```bash
# Скопируйте production переменные
vercel env pull .env.local

# Запустите dev сервер
npm run dev
```

---

## Возможные проблемы и решения

### Ошибка: `Error: Could not find a schema.prisma file`
```bash
npx prisma generate
```

### Ошибка: `Table 'public.Lead' doesn't exist`
```bash
npx prisma migrate deploy --prod
```

### Ошибка: `NEXTAUTH_SECRET must be at least 32 characters`
Сгенерируйте новый секрет:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Ошибка: `Invalid DATABASE_URL`
Проверьте, что connection string правильный и база данных доступна.

---

## Поддержка

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
