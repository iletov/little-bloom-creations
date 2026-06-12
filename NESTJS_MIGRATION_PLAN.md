# План за Миграция: Next.js към NestJS & Drizzle ORM

Този план описва последователните стъпки за миграция на бекенда, използвайки **Clean Architecture (Domain-Driven Design)** с ясно разделение на Контролери, Use Case-ове, Инфраструктурни услуги и Репозитории.

## Стъпка 1: Настройка на Drizzle ORM, База Данни и Конфигурации (Основа) [ ГОТОВО ЗА ТЕСТ ]
- Инсталиране на Drizzle ORM и PostgreSQL драйвър (`postgres-js`) в `apps/api`.
- Дефиниране на `schema.ts` (таблици: `products`, `product_variants`, `orders`, `order_shipping`, `order_items`, `webhook_events`).
- Интегриране на `@nestjs/config` (`ConfigModule.forRoot({ isGlobal: true })`) за сигурно четене на `.env` променливите (DATABASE_URL, STRIPE_SECRET_KEY и др.).
- **Управление на миграциите:** Генериране на миграции чрез `drizzle-kit generate`. Поради специфики на Supabase, SQL файловете се изпълняват директно в SQL Editor-а на платформата (избягваме `drizzle-kit push`).

## Стъпка 2: Споделени Типове и Валидация (class-validator) [ ГОТОВО ЗА ТЕСТ ]
- Използване на `class-validator` и `class-transformer` за дефиниране на NestJS DTO (Data Transfer Objects) (напр. `PlaceCashOrderDto`, `PlaceStripeOrderDto`).
- Имплементиране на глобален `ValidationPipe` в `main.ts` на NestJS (`whitelist: true`, `transform: true`).
- Споделените интерфейси и enums остават в `@repo/shared-types`, за да се ползват и от фронтенда.

## Стъпка 3: Глобална Обработка на Грешки (Global Exception Filter) [ ГОТОВО ЗА ТЕСТ ]
- Създаване на NestJS Exception Filter, който прихваща всички `HttpException` (и вътрешни грешки).
- Форматиране на JSON отговора за грешка така, че да съвпада на 100% със стария формат от Next.js API Routes. Това гарантира, че съществуващата логика във фронтенда за Toast нотификации няма да се счупи.

## Стъпка 4: Куриерски Услуги - Списъци (Имплементирано) [ ГОТОВО ЗА ТЕСТ ]
- Завършване на `ShippingModule` с контролери за извличане на статични данни.
- Интеграция на `EkontService` и `SpeedyService` зад общ интерфейс.
- Поддръжка на рутовете `GET /shipping/cities` и `GET /shipping/offices` чрез подаване на query параметър `courier` (ekont-office, speedy-delivery и т.н.).

## Стъпка 5: Калкулация на Доставка (Stateless логика) [ ГОТОВО ЗА ТЕСТ ]
- Мигриране на логиката от Server Actions (`calculateLabel` и `calculateLabelSpeedy`) в съответните NestJS сървиси.
- Създаване на ендпойнт `POST /shipping/calculate`.
- Обновяване на фронтенд функцията `labelValidation`, за да прави HTTP заявка към NestJS, вместо да вика Server Action.

## Стъпка 6: Четене на Продукти и Метрики (Read-only бази данни)
- Създаване на `ProductsModule` и `MetricsModule`.
- Мигриране на заявките от `supabase/lib/getAllProducts.ts` и `supabase/dashboard/getMetrics.ts`, използвайки Drizzle ORM (напр. `db.query.products.findMany(...)`).
- Пренасочване на фронтенда (Admin Dashboard и Каталог) да чете от тези NestJS ендпойнти.

## Стъпка 7: Авторизация на Потребители (Auth Guard)
- Имплементиране на NestJS Guard (`SupabaseAuthGuard`), който валидира JWT Access Token-а, изпратен от фронтенда в `Authorization` хедъра (използвайки `@supabase/supabase-js` само за верификация на токена).

## Стъпка 8: Поръчки и Транзакции (Core Business Logic)
- Използване на `OrdersModule` с `OrdersRepository` (който вече поддържа Drizzle транзакции `tx`).
- Имплементиране на `PlaceCashOrderUseCase`:
  1. Създаване на поръчката със статус `confirmed` в базата.
  2. Намаляване на складовите наличности.
  3. **Генериране на товарителници:** Товарителниците НЕ се генерират автоматично при създаване на поръчката. Всички товарителници (за наложен платеж и Stripe) се генерират ръчно от администратора през Dashboard-а на по-късен етап.
- Ендпойнт: `POST /orders/cash`.

## Стъпка 9: Stripe Интеграция и Webhooks (Имплементирано) [ ГОТОВО ЗА ТЕСТ ]
- Имплементиране на `InitiateStripeOrderUseCase` (`POST /orders/stripe/initiate`): Създава поръчка със статус `pending`, записва данните и връща `clientSecret`.
- Имплементиране на `ConfirmStripeOrderUseCase` чрез Webhook (`POST /orders/stripe/webhook`): 
  1. Парсва raw body и валидира Stripe Signature.
  2. При `payment_intent.succeeded` сменя статуса на `confirmed`.
  3. Намалява наличностите на стоката (inventory).
  4. Товарителницата се генерира ръчно впоследствие от администратора през Dashboard-а.
  5. При липса на наличност (race condition) – автоматичен Refund през `StripeService`.

## Стъпка 10: Финално Почистване
- Изтриване на старите Next.js API Routes и Server Actions от `apps/web`.
- Премахване на `@supabase/supabase-js` от бекенд заявките във фронтенда, където вече не е нужен.

## Какво ни предстои (Следващи стъпки по План)

За да завършим миграцията на 100%, предстои да имплементираме следните стъпки:

1. **Калкулация на Доставка (POST `/shipping/calculate`):** [ ГОТОВО ЗА ТЕСТ ]
   - Трябва да добавим рут `POST /shipping/calculate` в `shipping.controller.ts`, който да извиква `calculateShipping` от `ShippingEngineService`.
   - Ще обновим фронтенд логиката, за да прави реална HTTP заявка към този ендпоинт вместо стария Next.js Server Action.

2. **Довършване на Stripe Webhook Логиката (Inventory & Shipping):**
   - В `ConfirmStripeOrderUseCase` трябва да се добави реалното намаляване на наличностите (`decreaseStockSafely`), за да може стоката да се отписва от базата данни чак при успешно плащане.
   

3. **Модул за Метрики (`MetricsModule`):**
   - Трябва да създадем модула и да мигрираме SQL заявките за администраторския панел (таблото за управление/dashboard) към NestJS с Drizzle ORM.

4. **Потребителска Авторизация (`SupabaseAuthGuard`):**
   - Имплементиране на NestJS Guard, който да защитава администраторските ендпоинтове, проверявайки JWT токените, изпратени от фронтенда през Supabase.

5. **Финално прочистване и пренасочване:**
   - Премахване на старите Server Actions / API Routes от фронтенд приложението (`apps/web`) и насочването му изцяло към новия NestJS бекенд.

## Добавено на 11.06.2026: Допълнителни елементи за миграция (Открити при анализ)

След подробен анализ на `apps/web/app/api`, `apps/web/actions` и `apps/web/supabase`, бяха идентифицирани следните допълнителни компоненти, които трябва да бъдат мигрирани към NestJS:

### 1. Куриерски Модул (`ShippingModule`) - Допълнения [ ГОТОВО ЗА ТЕСТ ]
Освен калкулацията на цени и извличането на градове/офиси:
- **Валидация на адреси:** `validateAddress.ts`, `validateAddressSpeedy.ts`, `validateStreetSpeedy.ts`.
- **Генериране на товарителници (за ръчно създаване):** `createLabel.ts`, `createShipmentSpeedy.ts`.
- **Стари API рутове за изчистване:** `/api/ekont-get-cities`, `/api/ekont-get-countries`, `/api/ekont-get-offices`, `/api/speedy-get-cities`, `/api/speedy-get-offices`.

### 2. Поръчки и Плащания (`OrdersModule` & `StripeModule`) - Допълнения [ ГОТОВО ЗА ТЕСТ ]
- **Плащания:** Мигриране на `createCheckoutSessions.ts` и `cancelPaymentIntent.ts` към `StripeService`.
- **Стари API рутове за премахване/подмяна:** `/api/place-order-cash`, `/api/payment-intent`, `/api/cancel-payment`, `/api/webhook`, `/api/callback`.

### 3. Продуктов Каталог и Наличности (`ProductsModule`) [ ГОТОВО ЗА ТЕСТ ]
Директните заявки към Supabase от фронтенда трябва да се заменят с NestJS ендпойнти:
- **Наличности и картинки:** `checkQuantity.ts` (мигриран в `CheckProductQuantityUseCase`), `loadMoreImages.ts` (маркиран като legacy).
- **Четене на продукти (от `supabase/lib`):** `getAllProducts.ts` (`GET /products`), `getProductBySku.ts` (`GET /products/:sku`).

### 4. Административен Панел / Dashboard (`MetricsModule` & `AdminModule`)
Освен вече предвидения `getMetrics`:
- `supabase/dashboard/getOrders.ts` -> NestJS ендпойнт `GET /admin/orders` (защитен).
- `supabase/dashboard/updateOrder.ts` -> NestJS ендпойнт `PATCH /admin/orders/:id` (защитен).

### 5. Комуникация и Форми (`CommunicationModule` или `FormsModule`)
Тези Server Actions трябва да станат NestJS ендпойнти:
- `createContactUs.ts` -> `POST /contact`.
- `createEventForm.ts` -> `POST /events`.

### 6. Sanity CMS Интеграция (`SanityModule` / `WebhooksModule`)
Тези API рутове трябва да се мигрират към NestJS:
- `/api/sanity-data`, `/api/sanity-data-speedy`
- `/api/webhook-sanity`, `/api/webhook-status`