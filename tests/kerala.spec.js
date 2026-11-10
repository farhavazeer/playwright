const { test, expect } = require('@playwright/test');

test('Kerala Property Builder Registration', async ({ page }) => {
  await page.goto('https://keralaproperty.in/member/register/', { 
    waitUntil: 'domcontentloaded', 
    timeout: 45000 
  });

  await expect(page).toHaveTitle(/Kerala Property/i);

  const dropdown = page.locator('select[name="listowner"]');
  await dropdown.waitFor({ state: 'visible', timeout: 10000 });
  await dropdown.selectOption({ label: 'Builder' });

  await page.locator('input[name="utitle"], input#utitle').first().fill('Farha ');
  await page.locator('input[name="umail"], input#umail').first().fill('farha@gmail.com');
  await page.locator('input[name="memberpass"], input#memberpass').first().fill('Pass@122567');
  await page.locator('input[name="repass"], input#repass').first().fill('Pass@122567');
  await page.locator('input[name="umobile"], input#umobile').first().fill('9061863728');

  const submitBtn = page.locator('input#sub_regbutton, input[name="sub_regbutton"], input[type="submit"], button[type="submit"]').first();
  await submitBtn.click();

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'kerala-registration-result.png', fullPage: true });
});