import * as config from './config.json';

let envApiUrl = '';

if (config.env === 'production') {
  envApiUrl = `https://${config.appDomainProd}`;
} else if (config.env === 'staging') {
  envApiUrl = `https://${config.appDomainStag}`;
} else {
  envApiUrl = `http://${config.appDomainDev}`;
}

export const apiUrl = envApiUrl;
export const appName = config.appName;
