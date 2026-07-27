# Implementation Plan - Acrylic Product Custom Form

Introduce a premium custom personalization form for acrylic products. It enables users to configure:
1. Balloon counts (1 to 12) with three color modes: single color for all, custom colors for each individual balloon, or a gradient.
2. Custom inscription/text on the product.
3. Inscription text color.
4. Acrylic elements/designs selection using the pre-existing embroidery selection component structure.

## Proposed Changes

### Web Application

---

#### [NEW] [AcrylicForm.tsx](file:///e:/code/little-bloom-creations/apps/web/component/products/forms/AcrylicForm.tsx)
Create a new React component `AcrylicForm` that:
- Uses `react-hook-form` and `zod` for validation.
- Provides a quantity selector (1 to 12 balloons).
- Provides three color options:
  - **Един цвят за всички** (Single color for all) with a visual swatch grid.
  - **Различен цвят за всеки** (Different color for each) with an interactive preview showing each balloon number and allowing individual color setting.
  - **Градиент** (Gradient) allowing selection of start and end colors with a live gradient preview box.
- Input field for the inscription text (Cyrillic validation matching diary/blankets).
- Color selector for the inscription (Gold, Silver, White, Black).
- Element selector using the existing `EmbroideryModal` component logic (loaded from `product.personalizationOptions?.embroideryImages`).

#### [MODIFY] [validations.ts](file:///e:/code/little-bloom-creations/apps/web/lib/form-validation/validations.ts)
Add schema and types for the acrylic form:
- Define `acrylicFormSchema` using Zod.
- Define `AcrylicFormDataType` type.

#### [MODIFY] [ProductFormFactory.tsx](file:///e:/code/little-bloom-creations/apps/web/component/products/ProductFormFactory.tsx)
- Add a check for category slugs `acrylics` or `acrylic-products` to render the new `AcrylicForm`.

#### [MODIFY] [ItemsList.tsx](file:///e:/code/little-bloom-creations/apps/web/component/cart/items-list/ItemsList.tsx)
- Update the item details display in the cart to dynamically show the acrylic personalization options (balloon count, chosen colors/gradient, inscription, inscription color, and chosen element).

## Verification Plan

### Manual Verification
1. Open the detail page of an acrylic product (or mock/test with category slug `acrylics`).
2. Test selecting "Един цвят" and choose a color.
3. Test selecting "Различни цветове", change the balloon count, and verify you can customize the color of each balloon index individually.
4. Test selecting "Градиент", pick start/end colors, and verify the gradient preview.
5. Enter an inscription and select its color.
6. Open the Element Modal, select an element, and verify it updates the form.
7. Add to cart and verify it displays correctly in the cart sidebar / list.
8. Test edit mode from the cart page and ensure all values load correctly.
