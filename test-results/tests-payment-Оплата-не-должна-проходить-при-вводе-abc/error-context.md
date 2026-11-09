# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\payment.spec.js >> Оплата не должна проходить при вводе abc
- Location: tests\payment.spec.js:27:1

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('#status')
Expected substring: not "Оплата прошла"
Received string: "✅ Оплата прошла: NaN ₽"
Timeout: 5000ms

Call log:
  - Expect "not toContainText" locator('#status') with timeout 5000ms
  - waiting for locator('#status')
    14 × locator resolved to <span id="status" class="status ok">✅ Оплата прошла: NaN ₽</span>
       - unexpected value "✅ Оплата прошла: NaN ₽"

```

```yaml
- text: "✅ Оплата прошла: NaN ₽"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const path = require('path');
  3  | const { pathToFileURL } = require('url');
  4  | 
  5  | test.beforeEach(async ({ page }) => {
  6  |     await page.addInitScript(() => {
  7  |         Math.random = () => 0.99;
  8  |     });
  9  | 
  10 |     const file = path.resolve(__dirname, '../kedr_lite.html');
  11 |     await page.goto(pathToFileURL(file).href);
  12 | });
  13 | 
  14 | // Тест 1. Проверка успешной оплаты
  15 | test('Оплата 500 рублей проходит успешно', async ({ page }) => {
  16 |     await page.locator('#amount').fill('500');
  17 |     await page.locator('#pay').click();
  18 | 
  19 |     await expect(page.locator('#status'))
  20 |         .toContainText('Оплата прошла');
  21 | 
  22 |     await expect(page.locator('#total'))
  23 |         .toHaveText('500');
  24 | });
  25 | 
  26 | // Тест 2. Проверка некорректной суммы
  27 | test('Оплата не должна проходить при вводе abc', async ({ page }) => {
  28 |     await page.locator('#amount').fill('abc');
  29 |     await page.locator('#pay').click();
  30 | 
  31 |     const status = page.locator('#status');
  32 | 
  33 |     // Ждём окончания обработки оплаты
  34 |     await expect(status).not.toHaveText('Обработка…', {
  35 |         timeout: 10000
  36 |     });
  37 | 
  38 |     console.log(
  39 |         'Результат оплаты при вводе abc:',
  40 |         await status.innerText()
  41 |     );
  42 | 
  43 |     // Проверяем, что приложение не сообщило об успешной оплате
> 44 |     await expect(status).not.toContainText('Оплата прошла');
     |                              ^ Error: expect(locator).not.toContainText(expected) failed
  45 | });
```