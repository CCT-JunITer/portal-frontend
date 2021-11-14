import dotenv from 'dotenv';
dotenv.config();
const env = process.env.VUE_APP_ENV;

let envApiUrl = '';

if (env === 'production') {
  envApiUrl = `https://${process.env.VUE_APP_DOMAIN_PROD}`;
} else if (env === 'staging') {
  envApiUrl = 'http://127.0.0.1:8000';
} else {
  envApiUrl = 'http://127.0.0.1:8000';
}

export const apiUrl = envApiUrl;
