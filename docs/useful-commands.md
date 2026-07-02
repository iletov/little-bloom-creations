# Полезни команди и бележки (Little Bloom Creations)

Този файл съдържа най-често използваните команди и ключови бележки за разработката на проекта.

## 1. Стартиране на проекта

### Стартиране на Web App (Frontend + API)
```bash
npm run dev
```
*(Това стартира Next.js приложението локално с помощта на Turbopack на `http://localhost:3000`)*

## 2. Stripe

### Stripe Webhook (Локално тестване)
За да тестваш плащанията и webhook събитията локално, трябва да стартираш слушателя на Stripe CLI. Това ще пренасочва събитията (като успешни плащания) към твоето локално API.

```bash
stripe listen --forward-to localhost:3000/api/webhook
```
*Важно: След като изпълниш командата, терминалът ще ти даде `webhook signing secret` (започва с `whsec_...`). Увери се, че този ключ съвпада със `STRIPE_WEBHOOK_SECRET` в твоя `.env.local` файл, ако тестваш наново.*

## 3. Sanity (CMS и База данни)

### Генериране на типове за Sanity
Ако направиш промяна в схемата на Sanity (напр. добавиш ново поле), използвай тази команда, за да екстрактнеш схемата и да генерираш TypeScript типове.

```bash
npm run typegen
```
*(Командата зад кулисите изпълнява: `npx sanity@latest schema extract && npx sanity@latest typegen generate`)*

### Синхронизиране на продукти (Sanity към Supabase/Бекенд)
Ако добавиш нови продукти или промениш съществуващи в Sanity, но автоматичният webhook не ги обнови, можеш да стартираш ръчно скрипта за синхронизация, който ще прехвърли данните към базата данни на бекенда:

```bash
cd apps/web && node sync-sanity.js
```
*(Скриптът взима всички продукти и техните варианти от Sanity и ги ъпдейтва/вмъква в таблиците `products` и `product_variants` в Supabase.)*

## 4. Други важни команди

### Линтър (Проверка за грешки)
```bash
npm run lint
```

### Билд (Създаване на продукционна версия)
```bash
npm run build
```

### Търсене в кода (Grep)
Полезни команди за бързо намиране на специфични проблеми (напр. използване на `any` тип или стари ръчни транзакции):
```bash
git grep -n -E "catch \\([^)]*: any\\)" -- apps/api/src
git grep -n "tx?: any" -- apps/api/src
git grep -n "findWebhookEventByStripeId" -- apps/api/src/orders
git grep -n "createWebhookEventIfNotExists" -- apps/api/src
git ls-files apps/api/node_modules | head -20
git ls-files | grep -E '(^|/)node_modules/' | head -50

git ls-files | grep -E '(^|/)node_modules/' | xargs git rm --cached -- # това маха всичко наведнъж
```
