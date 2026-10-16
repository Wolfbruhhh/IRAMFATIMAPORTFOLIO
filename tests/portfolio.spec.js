import { test, expect } from '@playwright/test';

test('profile, media, résumé and channel destinations are available', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Iram Fatima/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building trust.');
  await expect(page.locator('.career-details')).toContainText('Relationship Manager (CRM)');
  await expect(page.getByText('Ralli International School · CBSE')).toBeVisible();
  expect(await page.locator('.portrait').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  const pdf = await page.request.get('/Iram-Fatima-Profile.pdf');
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  for (const url of ['https://www.youtube.com/@bittiwrites', 'https://www.youtube.com/@oldsongsqueen', 'https://www.instagram.com/bitti_writes/', 'https://www.instagram.com/miss.ecstatic_/']) {
    await expect(page.locator(`a[href="${url}"]`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('journey tabs work with pointer and keyboard', async ({ page }) => {
  await page.goto('/#journey');
  await page.getByRole('tab', { name: /Campus & leadership/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('NSS Class Representative');
  await expect(page.getByRole('tabpanel')).toContainText('Imagism');
  await page.getByRole('tab', { name: /Campus & leadership/ }).press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText('Kho-kho · Kabaddi · Badminton · Tug of war · Long jump');
  await expect(page.getByRole('tabpanel')).toContainText('Ralli International School');
  await page.getByRole('tab', { name: /School foundations/ }).press('Home');
  await expect(page.getByRole('tabpanel')).toContainText('Master’s in History');
});

test('contact email can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  await page.getByRole('button', { name: /Copy email address/ }).click();
  await expect(page.getByRole('status')).toHaveText('Email address copied. Let’s connect!');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('iramfatima22112002@gmail.com');
});

for (const width of [360, 390, 768, 1440]) {
  test(`layout and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    if (width < 801) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Creative side' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden();
      await expect(page).toHaveURL(/#creative$/);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
    }
    await page.goto('/');
    await page.screenshot({ path: `/tmp/iram-${width}.png`, fullPage: true });
  });
}
