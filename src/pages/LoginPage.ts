import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page object for the guest-facing login form (nav "Login" button + email/password modal).
export class LoginPage extends BasePage {
  private readonly navLoginButton = this.page.getByRole('button', { name: '🔑 Login' });
  private readonly emailInput = this.page.getByPlaceholder('Email');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly submitButton = this.page.getByRole('button', { name: 'Login', exact: true });

  constructor(page: Page) {
    super(page);
  }

  async open(baseUrl: string) {
    await this.basePageGoToUrl(baseUrl);
  }

  // Opens the login modal from the nav bar.
  async openLoginForm() {
    await this.basePageClickElement(this.navLoginButton);
  }

  async login(email: string, password: string) {
    await this.openLoginForm();
    await this.basePageVerifyElementIsVisible(this.emailInput);
    await this.basePageEnterText(this.emailInput, email);
    await this.basePageEnterText(this.passwordInput, password);
    await this.basePageClickElement(this.submitButton);
    // the SPA redirects to #dashboard only once the auth token has been issued and stored
    await this.page.waitForURL('**/#dashboard');
  }
}
