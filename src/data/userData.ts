import 'dotenv/config';

export const userData = {
  baseUrl: process.env.BASE_URL || 'https://ndosisimplifiedautomation.vercel.app/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://www.ndosiautomation.co.za/APIDEV',
  email: process.env.APP_EMAIL || 'tumi@gmail.com',
  password: process.env.APP_PASSWORD || '@12345678',
  // separate account so the API spec doesn't invalidate the UI spec's session (and vice versa) when run in parallel
  apiEmail: process.env.API_EMAIL || 'bokang@gmail.com',
  newProfilePicturePath: 'tests/new-profile-picture.png',
};

export const endpoints = {
  login: '/login',
  profile: '/profile',
  profileImage: '/profile/image',
};