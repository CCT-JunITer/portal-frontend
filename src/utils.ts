const getLocal = (key: string) => () => localStorage.getItem(key);
const saveLocal = (key: string) => (value: string) => localStorage.setItem(key, value);
const removeLocal = (key: string) => () => localStorage.removeItem(key);

export const getLocalToken = getLocal('token');
export const saveLocalToken = saveLocal('token');
export const removeLocalToken = removeLocal('token');

export const getLocalUserStatus = getLocal('userstate');
export const saveLocalUserStatus = saveLocal('userstate');
export const removeLocalUserStatus = removeLocal('userstate');

export function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}
