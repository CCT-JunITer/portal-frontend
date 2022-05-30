import dotenv from 'dotenv';
dotenv.config();
export const env = process.env.VUE_APP_ENV;

let envApiUrl = '';

if (env === 'production') {
  envApiUrl = 'https://stag.api.cct-ev.de';
} else if (env === 'staging') {
  envApiUrl = 'https://stag.api.cct-ev.de';
} else {
  envApiUrl = 'https://stag.api.cct-ev.de';
}

export const apiUrl = envApiUrl;
