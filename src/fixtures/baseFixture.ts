import { test as base, expect, Page, Response } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { EditProfilePage } from '../pages/EditProfilePage';

export interface ApiCall {
  url: string;
  method: string;
  status: number;
}

// Records every network response on the page so tests can assert on status codes after the fact.
export class ApiTracker {
  calls: ApiCall[] = [];

  constructor(page: Page) {
    page.on('response', (response: Response) => {
      this.calls.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
      });
    });
  }

  findCalls(urlSubstring: string, method: string): ApiCall[] {
    return this.calls.filter((call) => call.url.includes(urlSubstring) && call.method === method);
  }
}

type Fixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  profilePage: ProfilePage;
  editProfilePage: EditProfilePage;
  apiTracker: ApiTracker;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  editProfilePage: async ({ page }, use) => {
    await use(new EditProfilePage(page));
  },
  apiTracker: async ({ page }, use) => {
    await use(new ApiTracker(page));
  },
});

export { expect };
