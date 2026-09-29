import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

// Page object for the read-only "My Profile" view reached from the nav Menu.
export class ProfilePage extends BasePage {
  private readonly editProfileButton = this.page.getByRole('button', { name: '✏️ Edit Profile' });
  private readonly avatar = this.page.locator('.profile-avatar, [class*="avatar"]').first();

  constructor(page: Page) {
    super(page);
  }

  async openEditProfile() {
    await this.basePageVerifyElementIsVisible(this.editProfileButton);
    await this.basePageClickElement(this.editProfileButton);
  }

  /** Reads the avatar background-image URL so before/after uploads can be compared. */
  async getAvatarImageUrl(): Promise<string> {
    return this.page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('*'));
      const withAvatar = candidates.find((el) =>
        getComputedStyle(el).backgroundImage.includes('profile-images'),
      );
      return withAvatar ? getComputedStyle(withAvatar).backgroundImage : '';
    });
  }

  // The backend/CDN can take a moment to serve the newly uploaded avatar, so poll with reloads instead of a single check.
  async waitForAvatarUrlChange(previousUrl: string, timeoutMs = 15000): Promise<string> {
    let current = previousUrl;
    await expect(async () => {
      await this.page.reload();
      current = await this.getAvatarImageUrl();
      expect(current).not.toEqual(previousUrl);
      expect(current).toContain('profile-images');
    }).toPass({ timeout: timeoutMs });
    return current;
  }
}
