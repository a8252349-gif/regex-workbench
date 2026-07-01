import { test, expect } from "@playwright/test";

const localeLabels = {
  en: "Run now",
  ko: "지금 실행",
  ja: "今すぐ実行",
  es: "Ejecutar ahora",
  fr: "Exécuter",
  de: "Jetzt ausführen"
} as const;

for (const [locale, runLabel] of Object.entries(localeLabels)) {
  test(`${locale} tester renders localized source and works`, async ({ page, request }) => {
    const response = await request.get(`/${locale}/tester/`);
    expect(response.ok()).toBeTruthy();
    const source = await response.text();
    expect(source).toContain(`<html lang="${locale}"`);
    expect(source).toContain('name="google-adsense-account"');
    expect((source.match(/hrefLang=/gi) || []).length).toBe(7);

    await page.goto(`/${locale}/tester/`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("button", { name: runLabel })).toBeVisible();
    await page.locator("#pattern-tester").fill("(?<code>[A-Z]{2}\\d{4})");
    await page.locator("#text-tester").fill("AB2048 and XX9999");
    await page.getByRole("button", { name: runLabel }).click();
    await expect(page.getByTestId("match-list").locator("article")).toHaveCount(2);
  });
}

test("language switcher preserves the current page", async ({ page }) => {
  await page.goto("/en/replace/");
  await page.locator("header select").selectOption("fr");
  await expect(page).toHaveURL(/\/fr\/replace\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("URL locale wins over localStorage", async ({ page }) => {
  await page.goto("/en/tester/");
  await page.evaluate(() => localStorage.setItem("regex-workbench-locale", "en"));
  await page.goto("/ko/tester/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByRole("button", { name: "지금 실행" })).toBeVisible();
});

test("replace and extract produce output", async ({ page }) => {
  await page.goto("/en/replace/");
  await page.locator("#pattern-replace").fill("(\\w+),\\s*(\\w+)");
  await page.locator("#text-replace").fill("Kim, Mina");
  await page.locator("#replacement").fill("$2 $1");
  await page.getByRole("button", { name: "Run now" }).click();
  await expect(page.getByTestId("replace-result")).toContainText("Mina Kim");

  await page.goto("/en/extract/");
  await page.locator("#pattern-extract").fill("\\d+");
  await page.locator("#text-extract").fill("A12 B34");
  await page.getByRole("button", { name: "Run now" }).click();
  await expect(page.getByTestId("extract-result")).toContainText("12");
});

test("mobile layout has no document-level horizontal overflow", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "mobile project only");
  await page.goto("/ko/tester/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  const run = page.getByRole("button", { name: "지금 실행" });
  const box = await run.boundingBox();
  expect(box?.height || 0).toBeGreaterThanOrEqual(44);
});
