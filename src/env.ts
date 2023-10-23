import { getLocalBackendUrl, removeLocalBackendUrl, saveLocalBackendUrl } from './utils';

const findUrl = () => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;

  let envApiUrl = 'https://api.cct-ev.de';
  let envMode = 'production';

  if (process.env.VUE_APP_BACKEND_URL) {
    envApiUrl = process.env.VUE_APP_BACKEND_URL;
    envMode = '*';
  } else if (process.env.VUE_APP_ENV) {
    // legacy .env
    const domainMap = {
      'production': process.env.VUE_APP_DOMAIN_PROD,
      'staging': process.env.VUE_APP_DOMAIN_STAG,
    }
    if (domainMap[process.env.VUE_APP_ENV]) {
      envApiUrl = `https://${domainMap[process.env.VUE_APP_ENV]}`;
      envMode = process.env.VUE_APP_ENV;
    } else if (process.env.VUE_APP_DOMAIN_DEV) {
      envApiUrl = `http://${process.env.VUE_APP_DOMAIN_DEV}`;
      envMode = process.env.VUE_APP_ENV;
    }
  } else if (getLocalBackendUrl()) {
    envApiUrl = getLocalBackendUrl() || '';
    envMode = 'staging';
  } else if (hostname.startsWith('portal') || hostname.startsWith('stag')) {
    // production or staging portal
    envApiUrl = origin.replace('portal', 'api');
    envMode = hostname.startsWith('portal') ? 'production' : 'staging';
  } else {
    const isLocalhost = Boolean(
      hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

    if (isLocalhost) {
      // dev
      envApiUrl = 'http://localhost:8000';
      envMode = 'dev';
    }
  }
  console.log(`%cbackend url: ${envApiUrl}, env: ${envMode}`, 'color: red;');
  return { apiUrl: envApiUrl, env: envMode }
}

export let { apiUrl, env } = findUrl();


export const changeApi = (url?: string, save=true) => {
  if (!url) {
    removeLocalBackendUrl();
    const envApi = findUrl();
    apiUrl = envApi.apiUrl;
    env = envApi.env;
    return;
  }
  apiUrl = url;
  env = 'staging';
  if (save) {
    saveLocalBackendUrl(apiUrl);
  }
}