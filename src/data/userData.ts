// Central place for test data, credentials, and endpoint paths (values overridable via .env / CI secrets)
export const userData = {
  baseUrl: process.env.BASE_URL || 'https://ndosisimplifiedautomation.vercel.app/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://www.ndosiautomation.co.za/APIDEV',
  // NOTE: Windows predefines a USERNAME env var (the OS login name) — set USERNAME/PASSWORD explicitly in .env/CI secrets to avoid it silently overriding this.
  email: process.env.USERNAME || 'tumi@gmail.com',
  password: process.env.PASSWORD || '@12345678',
  newProfilePicturePath: 'tests/new-profile-picture.png',
};

export const endpoints = {
  login: '/login',
  profile: '/profile',
  profileImage: '/profile/image',
};
