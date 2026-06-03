# Ръководство за локално тестване на бекенда (NestJS API)

Този документ описва как да стартирате бекенда локално и как да тествате ключови ендпоинти, свързани с изчисляване на доставката и Stripe плащанията, използвайки Postman и Stripe CLI.

---

## 1. Стартиране на сървъра

NestJS бекендът се намира в папката `apps/api`. По подразбиране е настроен да стартира на **порт 3001**.

### Стъпки за стартиране:
1. Отворете терминал и навигирайте до основната папка на проекта (или директно в `apps/api`).
2. Стартирайте приложението в режим за разработка (watch mode) чрез следната команда:
   ```bash
   # Ако стартирате от основната папка чрез Turbo:
   npm run dev

   # ИЛИ ако стартирате специфично само API-то:
   cd apps/api
   npm run start:dev
   ```
3. В терминала трябва да видите съобщение, че сървърът е стартирал успешно. Базовият URL за тестване ще бъде:
   **`http://localhost:3001`**

---

## 2. Как да тествате `POST /shipping/calculate` с Postman

Този ендпоинт служи за изчисляване на цената на доставката на база на избрания метод и артикули.

1. Отворете Postman и създайте нова заявка (**New Request**).
2. Задайте метода на **POST**.
3. Задайте URL адреса: `http://localhost:3001/shipping/calculate`
4. Отидете в таба **Headers** и се уверете, че имате:
   - `Content-Type`: `application/json`
5. Отидете в таба **Body**, изберете **raw**, и се уверете, че формата е **JSON**.
6. Поставете един от следните тестови JSON-и в Body:

**Пример 1: Доставка до адрес (Спиди)**
```json
{
  "deliveryMethod": "speedy-delivery",
  "totalWeight": 0.5,
  "totalAmount": 51.00,
  "recipientAddress": {
    "city": "София",
    "street": "бул. България",
    "streetNumber": "1",
    "siteId": 68134
  },
  "recipientInfo": {
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "0888123456",
    "email": "ivan@example.com"
  },
  "parcels": [{ "seqNo": 1, "weight": 0.5, "width": 10, "height": 10, "depth": 10 }]
}
```

**Пример 2: Доставка до адрес (Еконт)**
```json
{
  "deliveryMethod": "ekont-delivery",
  "totalWeight": 0.5,
  "totalAmount": 51.00,
  "recipientAddress": {
    "city": "София",
    "street": "бул. България",
    "streetNumber": "1"
  },
  "recipientInfo": {
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "0888123456",
    "email": "ivan@example.com"
  },
  "parcels": [{ "seqNo": 1, "weight": 0.5, "width": 10, "height": 10, "depth": 10 }]
}
```

**Пример 3: Доставка до офис на Спиди**
*Забележка: При доставка до офис, трябва да подадете `officeId` в `recipientInfo`.*
```json
{
  "deliveryMethod": "speedy-office",
  "totalWeight": 0.5,
  "totalAmount": 51.00,
  "recipientAddress": { "city": "София" },
  "recipientInfo": {
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "0888123456",
    "email": "ivan@example.com",
    "officeId": "2"
  },
  "parcels": [{ "seqNo": 1, "weight": 0.5, "width": 10, "height": 10, "depth": 10 }]
}
```

**Пример 4: Доставка до офис на Еконт**
```json
{
  "deliveryMethod": "ekont-office",
  "totalWeight": 0.5,
  "totalAmount": 51.00,
  "recipientAddress": { "city": "София" },
  "recipientInfo": {
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "0888123456",
    "email": "ivan@example.com",
    "officeId": "1123" 
  },
  "parcels": [{ "seqNo": 1, "weight": 0.5, "width": 10, "height": 10, "depth": 10 }]
}
```

7. Натиснете бутона **Send**. Отговорът трябва да ви върне калкулираната сума за доставка.

---

## 3. Как да тествате `POST /orders/stripe/webhook` (Stripe Webhook)

**Внимание:** Не можете просто да пратите обикновен JSON през Postman към Webhook ендпоинта. Stripe изисква криптографски подпис (signature) в хедърите на заявката, за да се увери, че събитието наистина идва от тях. Ако подписите не съвпадат, NestJS ще върне грешка `400 Bad Request`.

Затова, правилният начин за локално тестване е използването на **Stripe CLI**.

### Стъпки за тестване на Webhook:

1. **Инсталирайте Stripe CLI**
   Изтеглете го от официалния сайт на Stripe (или използвайте пакетен мениджър: `brew install stripe/stripe-cli/stripe` за Mac/Linux, или изтеглете `.exe` за Windows).

2. **Впишете се в Stripe акаунта си**
   Отворете нов терминал и напишете:
   ```bash
   stripe login
   ```
   (Следвайте линка, който ще се отвори в браузъра, за да разрешите достъпа).

3. **Слушайте за събития и ги пренасочвайте към localhost**
   В същия терминал стартирайте пренасочването към локалния ви бекенд сървър:
   ```bash
   stripe listen --forward-to localhost:3001/orders/stripe/webhook
   ```
   *(Уверете се, че рутът е точен спрямо това как сте го дефинирали във вашия контролер).*

4. **Вземете Webhook Secret-а**
   Когато стартирате горната команда, в конзолата ще се изпише нещо подобно на:
   > `Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxx (^C to quit)`

   Копирайте този `whsec_...` ключ.

5. **Конфигурирайте `.env` файла на API-то**
   Отидете в `apps/api/.env` и задайте променливата:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxx
   ```
   Рестартирайте NestJS сървъра, за да зареди новия ключ.

6. **Симулирайте плащане (Тригърване на събитие)**
   Сега имате два варианта да тествате логиката (намаляването на наличности и capture на сумата):

   **Вариант А (Препоръчителен - пълен флоу):**
   Направете поръчка през локалния ви фронтенд, въведете фиктивна Stripe карта (напр. `4242 4242 4242 4242`) и завършете плащането. Stripe автоматично ще прати събитието `payment_intent.succeeded` до Stripe CLI, а той ще го пренасочи към `http://localhost:3001/orders/stripe/webhook` с валидни подписи. Ще видите логовете в конзолата на NestJS.

   **Вариант Б (Ръчно тригърване през терминала):**
   Отворете трети терминал и извикайте командата:
   ```bash
   stripe trigger payment_intent.succeeded
   ```
   *Забележка: Този вариант изпраща generic събитие. Тъй като вашият код разчита на реално `orderId` в метаданните на PaymentIntent-a, `ConfirmStripeOrderUseCase` може да хвърли грешка, че не намира поръчка с такова ID. Затова Вариант А е по-добър за тестване на пълния бизнес процес.*
