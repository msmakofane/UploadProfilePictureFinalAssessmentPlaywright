import 'dotenv/config';

export const userData = {
  baseUrl: process.env.BASE_URL || 'https://ndosisimplifiedautomation.vercel.app/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://www.ndosiautomation.co.za/APIDEV',
  email: process.env.APP_EMAIL || 'tumi@gmail.com',
  password: process.env.APP_PASSWORD || '@12345678',
  newProfilePicturePath: 'tests/new-profile-picture.png',
};

export const endpoints = {
  login: '/login',
  profile: '/profile',
  profileImage: '/profile/image',
};