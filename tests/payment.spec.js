const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        Math.random = () => 0.99;
    });

    const file = path.resolve(__dirname, '../kedr_lite.html');
    await page.goto(pathToFileURL(file).href);
});

// Тест 1. Проверка успешной оплаты
test('Оплата 500 рублей проходит успешно', async ({ page }) => {
    await page.locator('#amount').fill('500');
    await page.locator('#pay').click();

    await expect(page.locator('#status'))
        .toContainText('Оплата прошла');

    await expect(page.locator('#total'))
        .toHaveText('500');
});

// Тест 2. Проверка некорректной суммы
test('Оплата не должна проходить при вводе abc', async ({ page }) => {
    await page.locator('#amount').fill('abc');
    await page.locator('#pay').click();

    const status = page.locator('#status');

    // Ждём окончания обработки оплаты
    await expect(status).not.toHaveText('Обработка…', {
        timeout: 10000
    });

    console.log(
        'Результат оплаты при вводе abc:',
        await status.innerText()
    );

    // Проверяем, что приложение не сообщило об успешной оплате
    await expect(status).not.toContainText('Оплата прошла');
});