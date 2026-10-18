import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { userData, endpoints } from '../../src/data/userData';

test.describe('Ndosi API — end-to-end profile picture upload (API only)', () => {
  test('login, fetch profile, upload picture, and verify via API calls only', async ({ request }) => {
    const filePath = path.resolve(userData.newProfilePicturePath);
    expect(fs.existsSync(filePath), `Image file not found: ${filePath}`).toBeTruthy();

    const loginUrl = `${userData.apiBaseUrl}${endpoints.login}`;
    const profileUrl = `${userData.apiBaseUrl}${endpoints.profile}`;
    const uploadUrl = `${userData.apiBaseUrl}${endpoints.profileImage}`;

    let loginRes;
    let loginText = '';
    let loginBody: any = {};
    let authToken = '';
    let cookieHeader = '';

    const payloadCandidates = [
      { headers: { 'Content-Type': 'application/json' }, data: { email: userData.email, password: userData.password } },
      { form: { email: userData.email, password: userData.password } },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: `email=${encodeURIComponent(userData.email)}&password=${encodeURIComponent(userData.password)}`,
      },
    ];

    for (const payload of payloadCandidates) {
      loginRes = await request.post(loginUrl, {
        failOnStatusCode: false,
        ...payload,
      });

      loginText = await loginRes.text();

      try {
        loginBody = JSON.parse(loginText);
      } catch {
        loginBody = {};
      }

      authToken =
        loginBody?.token ??
        loginBody?.data?.token ??
        loginBody?.accessToken ??
        loginBody?.data?.accessToken ??
        loginBody?.jwt ??
        loginBody?.data?.jwt ??
        loginBody?.tokenValue ??
        loginBody?.result?.token ??
        loginBody?.body?.token ??
        loginBody?.auth?.token ??
        '';

      cookieHeader = loginRes.headers()['set-cookie'] ?? '';

      const authHeader =
        loginRes.headers()['authorization'] ??
        loginRes.headers()['x-auth-token'] ??
        loginRes.headers()['x-access-token'] ??
        '';

      if (loginRes.status() === 200 && (authToken || authHeader || cookieHeader)) {
        break;
      }
    }

    expect(loginRes.status(), `Login failed: ${loginText}`).toBe(200);

    const authHeader =
      loginRes.headers()['authorization'] ??
      loginRes.headers()['x-auth-token'] ??
      loginRes.headers()['x-access-token'] ??
      '';

    const headers: Record<string, string> = {};
    if (authToken) {
      headers.authorization = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    }
    if (authHeader) {
      headers.authorization = authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`;
    }
    if (cookieHeader) {
      headers.cookie = Array.isArray(cookieHeader)
        ? cookieHeader.map((c) => c.split(';')[0]).join('; ')
        : cookieHeader
            .split(',')
            .map((c) => c.split(';')[0])
            .join('; ');
    }

    expect(authToken || authHeader || cookieHeader, `No auth returned by login: ${loginText}`).toBeTruthy();

    let profileRes = await request.get(profileUrl, {
      failOnStatusCode: false,
      headers,
    });

    if (profileRes.status() === 401 && authToken) {
      profileRes = await request.get(profileUrl, {
        failOnStatusCode: false,
        headers: {
          authorization: authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`,
          ...(cookieHeader ? { cookie: headers.cookie } : {}),
        },
      });
    }

    expect(profileRes.status(), `Profile fetch failed: ${await profileRes.text()}`).toBe(200);

    let uploadRes;
    const fieldNames = ['file', 'image', 'avatar', 'photo', 'profileImage'];

    for (const fieldName of fieldNames) {
      uploadRes = await request.post(uploadUrl, {
        failOnStatusCode: false,
        headers,
        multipart: {
          [fieldName]: fs.createReadStream(filePath),
        },
      });

      if ([200, 201, 204].includes(uploadRes.status())) {
        break;
      }
    }

    const uploadText = uploadRes ? await uploadRes.text() : 'No upload response';

    expect(uploadRes, `Upload request never returned a response. Last body: ${uploadText}`).toBeTruthy();

    if (!uploadRes) {
      throw new Error(`Upload request never returned a response. Last body: ${uploadText}`);
    }

    expect(uploadRes.status(), `Upload failed: ${uploadText}`).toBe(200);
  });
});