import path from 'path';
import { test, expect } from '../src/fixtures/baseFixture';
import { userData } from '../src/data/userData';

// End-to-end UI journey: login -> menu -> my profile -> edit profile -> upload -> verify + API status checks.
test.describe('Profile picture upload', () => {
  test('user can upload a new profile picture from Edit Profile', async ({
    page,
    loginPage,
    homePage,
    profilePage,
    editProfilePage,
    apiTracker,
  }) => {
    await test.step('Login to the Ndosi automation test site', async () => {
      await loginPage.open(userData.baseUrl);
      await loginPage.login(userData.email, userData.password);
      await loginPage.screenshot('01-login-success');
    });

    await test.step('Click Menu', async () => {
      await homePage.openMenu();
      await homePage.screenshot('02-menu-open');
    });

    await test.step('Click My Profile', async () => {
      await homePage.goToMyProfile();
      await profilePage.screenshot('03-my-profile');
    });

    const avatarBefore = await profilePage.getAvatarImageUrl();

    await test.step('Click Edit Profile', async () => {
      await profilePage.openEditProfile();
      await profilePage.screenshot('04-edit-profile');
    });

    await test.step('Upload a new profile picture', async () => {
      const imagePath = path.resolve(userData.newProfilePicturePath);
      await editProfilePage.uploadPicture(imagePath);
      await editProfilePage.screenshot('05-picture-selected');
      await editProfilePage.save();
    });

    await test.step('Ensure the profile picture is updated', async () => {
      const avatarAfter = await profilePage.waitForAvatarUrlChange(avatarBefore);
      await profilePage.screenshot('06-profile-updated');
      expect(avatarAfter).not.toEqual(avatarBefore);
      expect(avatarAfter).toContain('profile-images');
    });

    await test.step('Validate API response codes for login, menu/profile navigation, and photo upload', async () => {
      const loginCalls = apiTracker.findCalls('/login', 'POST');
      const profileGetCalls = apiTracker.findCalls('/profile', 'GET');
      const profileImageCalls = apiTracker.findCalls('/profile/image', 'POST');

      expect(loginCalls.length).toBeGreaterThan(0);
      expect(profileGetCalls.length).toBeGreaterThan(0);
      expect(profileImageCalls.length).toBeGreaterThan(0);

      for (const call of [...loginCalls, ...profileGetCalls, ...profileImageCalls]) {
        expect(call.status, `${call.method} ${call.url} should return 2xx`).toBeGreaterThanOrEqual(200);
        expect(call.status, `${call.method} ${call.url} should return 2xx`).toBeLessThan(300);
      }

      console.log('Captured API calls:', JSON.stringify(apiTracker.calls, null, 2));
    });
  });
});
