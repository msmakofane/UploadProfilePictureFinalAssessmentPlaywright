import { Page, Locator, expect, test } from '@playwright/test';

// Shared base class with reusable page actions used by all page objects.
export class BasePage {
  constructor(public page: Page) {
    this.page = page;
  }

  // Navigate the current page to the given URL.
  async basePageGoToUrl(url: string) {
    await this.page.goto(url);
  }

  // Click an element, optionally forcing the click past overlays/visibility checks.
  async basePageClickElement(locator: Locator, options?: { force?: boolean }) {
    await locator.click(options);
  }

  // Clear an input field then type the given text into it.
  async basePageEnterText(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  // Select an option in a dropdown by value or label.
  async basePageSelectOption(locator: Locator, value: string | { label?: string; value?: string }) {
    await locator.selectOption(value);
  }

  // Read the current value of an input field.
  async basePageGetTextValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  // Assert that an element is visible on the page.
  async basePageVerifyElementIsVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  // Capture a full-page screenshot, saved to disk and attached to the HTML report.
  async screenshot(name: string) {
    const buffer = await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    await test.info().attach(name, { body: buffer, contentType: 'image/png' });
  }
}
