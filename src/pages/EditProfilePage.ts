import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page object for the "Edit Profile" form, including the profile picture upload control.
export class EditProfilePage extends BasePage {
  private readonly fileInput = this.page.locator('#profilePicture');
  private readonly saveButton = this.page.getByRole('button', { name: '💾 Save Changes' });

  constructor(page: Page) {
    super(page);
  }

  // Selecting a file triggers the app's own upload call (POST /profile/image); its timing
  // relative to the "Save Changes" click isn't guaranteed, so callers should wait for that
  // response themselves rather than assuming it's settled before save() returns.
  async uploadPicture(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async save() {
    // the app confirms the save with a native alert() dialog that must be accepted to continue
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.basePageVerifyElementIsVisible(this.saveButton);
    await this.basePageClickElement(this.saveButton);
    await this.page.waitForTimeout(500);
  }
}
