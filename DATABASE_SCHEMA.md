# Supabase База Данни - Схема и Взаимодействия (За Gemini)

Този документ описва структурата на съществуващата PostgreSQL база данни (Supabase) за проекта "Little Bloom Creations", включително ключовите таблици, техните полета и релациите (Foreign Keys) помежду им. Това е напълно достатъчно на Gemini, за да изгради точната Drizzle ORM схема.

## 1. Диаграма на релациите (Mermaid)

```mermaid
erDiagram
    products ||--o{ product_variants : "има варианти (parent_sku)"
    orders ||--|| order_shipping : "има детайли за доставка"
    orders ||--o{ order_items : "съдържа артикули"
    orders ||--o| webhook_events : "проследява статус на плащане"
    products ||--o{ order_items : "се поръчват (sku)"
    product_variants ||--o{ order_items : "варианти се поръчват (variant_sku)"

    products {
        string sku PK
        string name
        numeric price
        numeric discount
        numeric weight
        numeric width
        numeric height
        numeric length
        numeric depth
        integer current_stock
        boolean is_active
    }

    product_variants {
        string variant_sku PK
        string parent_sku FK
        string variant_name
        numeric price
        integer current_stock
        boolean is_active
    }

    orders {
        string order_number PK "Уникален идентификатор (пр. LBC-12345)"
        uuid id "Вътрешен идентификатор"
        timestamp created_at
        string status "pending, confirmed, refunded, и т.н."
        numeric total_amount
        numeric subtotal
        numeric delivery_cost
        string delivery_method "ekont-office, speedy-delivery и др."
        string payment_method "bank, cash"
        string shipment_number "Номер на товарителница (nullable)"
    }

    order_shipping {
        uuid id PK
        string order_number FK
        string full_name
        string email
        string phone
        string country
        string city
        string postal_code
        string street
        string street_number
        string block_no
        string entrance_no
        string floor_no
        string apartment_no
        string office_code
        text additional_info
    }

    order_items {
        uuid id PK
        string order_number FK
        string sku FK "Референция към products"
        string variant_sku FK "Референция към product_variants (nullable)"
        string name
        string variant_name
        integer quantity
        numeric unit_price
        numeric subtotal
        numeric weight
        jsonb personalization "Запазени данни за персонализация"
    }

    pending_orders {
        uuid id PK
        string stripe_payment_intent_id "Уникален Stripe Intent"
        string order_number
        jsonb cart_items
        jsonb order_details "Адрес и клиентски данни"
        jsonb order_methods "Методи за плащане и доставка"
        jsonb metadata "Допълнителни метаданни"
        string status "pending, failed"
        text error_message
    }

    webhook_events {
        uuid id PK
        string stripe_payment_intent
        string order_number
        uuid order_id FK "Връзка към orders.id при успех (nullable)"
        string event_type "пр. payment_intent.succeeded"
        string status "pending, success, failed, refunded"
        text error_message
    }
```

## 2. Описание на Таблиците и Взаимодействията

### Каталог (Продукти и Варианти)
* **`products`**: Основната таблица за продукти. Първичният ключ (Primary Key) е `sku` (напр. "BOX-001"). Съдържа размери, тегло, цена и налични бройки (`current_stock`).
* **`product_variants`**: Дъщерна таблица за варианти на продукта (напр. различни цветове/размери). Свързана е към `products` чрез Foreign Key `parent_sku`.

### Поръчки (Orders)
* **`orders`**: Основната таблица, пазеща метаданните за поръчката. Първичният ключ в бизнес логиката обикновено е `order_number` (генериран от системата низ). Пази статуса на поръчката, общата сума, цената за доставка и евентуално номера на реалната товарителница (`shipment_number`), след като тя бъде генерирана от куриера.
* **`order_shipping`**: Таблица с релация 1-към-1 спрямо `orders`. Съдържа всички лични данни на клиента и точния адрес/офис за доставка. Свързана е към `orders` чрез `order_number` (или `order_id`).
* **`order_items`**: Таблица с релация 1-към-Много спрямо `orders`. Всеки запис е конкретен артикул в количката на клиента. Пази `sku` и `variant_sku`, за да знаем какво точно се купува. Също така запазва JSON обект `personalization` с изисквания за гравюри/текстове, избрани от клиента.

### Плащания и Stripe (Временни състояния)
* **`pending_orders`**: Временна таблица. Когато потребителят започне плащане с карта (Stripe Checkout), тук се "паркира" цялата му количка под формата на JSON, заедно със `stripe_payment_intent_id`. Това предотвратява изгубване на данни, докато чакаме отговор от банката. След успешен Stripe Webhook, данните от тук се местят в истинските таблици (`orders`, `order_items`, `order_shipping`).
* **`webhook_events`**: Таблица за одит (Audit Log). Записва всяко събитие, получено от Stripe. Използва се и от фронтенда (чрез polling), за да разбере дали плащането е преминало в статус `success` или `failed`, и за да пренасочи клиента към страницата за успешна поръчка. Свързана е към финалната поръчка чрез `order_id` (само при успех).
