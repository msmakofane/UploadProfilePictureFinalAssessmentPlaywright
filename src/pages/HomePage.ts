import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page object for the authenticated dashboard's top nav ("Menu" dropdown -> "My Profile").
export class HomePage extends BasePage {
  private readonly menuButton = this.page.getByRole('button', { name: 'Menu' });
  private readonly myProfileLink = this.page.getByText('My Profile', { exact: true });

  constructor(page: Page) {
    super(page);
  }

  async openMenu() {
    await this.basePageClickElement(this.menuButton);
  }

  async goToMyProfile() {
    // the "My Profile" link only renders once the Menu dropdown has been opened
    await this.openMenu();
    await this.basePageVerifyElementIsVisible(this.myProfileLink);
    await this.basePageClickElement(this.myProfileLink);
    await this.page.waitForURL('**/#profile');
  }
}