import 'dotenv/config';

export const userData = {
  baseUrl: process.env.BASE_URL || 'https://ndosisimplifiedautomation.vercel.app/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://www.ndosiautomation.co.za/APIDEV',
  email: process.env.APP_EMAIL || 'tumi@gmail.com',
  password: process.env.APP_PASSWORD || '@12345678',
  // separate account so the API spec's login doesn't invalidate the UI spec's session (backend allows one session per user)
  apiEmail: process.env.API_EMAIL || 'bokang@gmail.com',
  newProfilePicturePath: 'tests/new-profile-picture.png',
};

export const endpoints = {
  login: '/login',
  profile: '/profile',
  profileImage: '/profile/image',
};