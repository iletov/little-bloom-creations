# Документация: Econt и Speedy API интеграция

Този документ описва структурите от данни (payloads), които се изпращат към куриерските фирми Econt и Speedy при валидация на адрес, калкулация на цена и създаване на товарителница (shipment/label). Тази информация е извлечена от файловете в `apps/web/actions/ekont` и `apps/web/actions/speedy`.

---

## 1. Econt (Еконт)

Интеграцията с Еконт използва `Basic Auth`, където `ECONT_API_KEY` се кодира в `Base64`.
Основен URL: `process.env.EKONT_API_URL`

### 1.1 Валидиране на адрес
**Endpoint:** `POST /Nomenclatures/AddressService.validateAddress.json`

**Payload:**
```json
{
  "address": {
    "city": {
      "postCode": "string (напр. 1000)",
      "name": "string (напр. София)"
    },
    "street": "string",
    "num": "string",
    "other": "string (допълнително описание)"
  }
}
```

### 1.2 Калкулиране на цена и Създаване на товарителница
Еконт използват един и същ endpoint за изчисляване на цена, валидация на данни и същинско създаване на товарителница. Разликата е в полето `mode`.

**Endpoint:** `POST /Shipments/LabelService.createLabel.json`

**Възможни стойности за `mode`:**
- `"calculate"` - само изчислява цената (от `calculateLabel.ts`)
- `"validate"` - проверява данните за грешки преди създаване (от `createLabel.ts`)
- `"create"` - реално създава товарителницата в системата на Еконт

**Payload структура:**
```json
{
  "label": {
    "senderClient": {
      "name": "string",
      "phones": ["string"]
      // При create се подават и email, juridicalEntity, ein и др.
    },
    "senderAddress": {
      "city": {
        "name": "string",
        "postCode": "string",
        "country": { "code3": "BGR" }
      },
      "street": "string",
      "num": "string"
    },
    "receiverClient": {
      "name": "Име Фамилия",
      "phones": ["string (телефон)"]
    },
    "receiverAddress": {
      // Пълни се само ако е доставка до адрес (`delivery`). Ако е до офис е празно.
      "city": { "name": "град", "postCode": "код", "country": { "code3": "BGR" } },
      "street": "string",
      "num": "string",
      "quarter": "string",
      "other": "string"
    },
    "senderDeliveryType": "office / door",
    "senderOfficeCode": "string",
    "receiverOfficeCode": "string", // Код на офис, ако доставката е до офис
    "receiverDeliveryType": "office | delivery",
    "packCount": 1,
    "shipmentType": "PACK",
    "weight": 1.5, // Общо тегло
    
    // Само при режим 'create'
    "shipmentDescription": "string",
    "packingListType": "digital",
    "packingList": [ /* Масив с артикулите */ ],

    // Наложен платеж (CD)
    "services": {
      "cdType": "GET",
      "cdAmount": "Обща сума",
      "cdCurrency": "BGN / EUR",
      "cdPayOptions": {
        "client": { "name": "Име", "phones": ["Тел"] },
        "method": "bank",
        "IBAN": "BG21...",
        "BIC": "...",
        "bankCurrency": "BGN",
        "payDays": 1
      }
    }
  },
  "mode": "calculate | validate | create"
}
```

---

## 2. Speedy (Спиди)

Интеграцията със Спиди изисква изпращане на `userName` и `password` (от `.env`) във всеки payload.
Основен URL: `process.env.SPEEDY_BASE_URL`

### 2.1 Валидиране на улица (Търсене на ID на улица)
**Endpoint:** `POST /location/street`

**Payload:**
```json
{
  "userName": "string",
  "password": "string",
  "siteId": 68134, // ID на населеното място в номенклатурата на Спиди
  "name": "Име на улица"
}
```

### 2.2 Валидиране на данни за пратка
Преди същинското създаване, се подават всички данни за получател и пратка, за да се валидират.
**Endpoint:** `POST /validation/shipment`

**Payload:** *(подобен на Create Shipment, виж по-долу, липсва sender инфо)*

### 2.3 Калкулиране на цена
**Endpoint:** `POST /calculate`

**Payload:**
```json
{
  "userName": "string",
  "password": "string",
  "sender": { "clientId": 9999999998000 },
  "recipient": {
    "privatePerson": true,
    // Ако е до офис:
    "pickupOfficeId": 1234,
    // Ако е до адрес:
    "addressLocation": { "siteId": 68134 }
  },
  "service": {
    "autoAdjustPickupDate": true,
    "serviceIds": [505],
    "additionalServices": { /* виж секция "Допълнителни услуги" */ }
  },
  "content": {
    "parcelsCount": 1,
    "parcels": [
      { "seqNo": 1, "size": { "width": 10, "height": 10, "depth": 10 }, "weight": 1.5, "ref1": "..." }
    ],
    "package": "ENVELOP",
    "contents": "КАНЦ. МАТЕР."
  },
  "payment": {
    "courierServicePayer": "RECIPIENT",
    "declaredValuePayer": "RECIPIENT"
  }
}
```

### 2.4 Създаване на товарителница (Create Shipment)
**Endpoint:** `POST /shipment`

**Payload:**
```json
{
  "userName": "string",
  "password": "string",
  "sender": {
    "clientId": "9999999998000",
    "contactName": "IVAN PETROV",
    "email": "ivan@petrov.bg",
    "phone1": { "number": "0888112233" }
  },
  "recipient": {
    "privatePerson": true,
    "clientName": "Име Фамилия",
    "email": "client@mail.bg",
    "phone1": { "number": "0888888888" },
    
    // АКО Е ДО ОФИС:
    "pickupOfficeId": 1234
    
    // АКО Е ДО АДРЕС:
    // "address": {
    //   "siteId": 68134,
    //   "streetId": 12345,
    //   "streetNo": "10",
    //   "blockNo": "...",
    //   "entranceNo": "...",
    //   "floorNo": "...",
    //   "apartmentNo": "..."
    // }
  },
  "service": {
    "autoAdjustPickupDate": true,
    "serviceId": 505,
    "saturdayDelivery": true,
    "additionalServices": { /* виж по-долу */ }
  },
  "content": {
    "parcelsCount": 1,
    "parcels": [ /* масив от пратки */ ],
    "contents": "КАНЦ. МАТЕР.",
    "package": "ENVELOPE"
  },
  "payment": {
    "courierServicePayer": "RECIPIENT",
    "declaredValuePayer": "RECIPIENT"
  }
}
```

### * Допълнителни услуги на Спиди (additionalServices)
При наложен платеж (в брой) се изпращат данните за фискален бон и обявена стойност:
```json
{
  "cod": {
    "amount": 100.00, // Обща сума
    "processingType": "CASH",
    "payoutToLoggedClient": true,
    "fiscalReceiptItems": [ /* Масив от артикули (ReceiptItem) */ ]
  },
  "obpd": {
    "option": "OPEN", // Преглед преди плащане
    "returnShipmentServiceId": 505,
    "returnShipmentPayer": "SENDER"
  },
  "declaredValue": {
    "amount": 100.00,
    "fragile": true
  }
}
```
