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


function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}


export function financeRequestNextStep(status: string): string {
  switch (status) {
  case 'created': return 'Finanzvorstand entscheidet über Budget';
  case 'request_rejected': return 'Budget anpassen';
  case 'request_accepted': return 'Rechnung hochladen';
  case 'file_uploaded': return 'Rechnungsprüfung druch Finanzvorstand';
  case 'file_rejected': return 'Rechnung anpassen und erneut hochladen';
  case 'file_accepted': return 'Keine';
  default: return '';
  }
}

export function translateFinanceRequestStatus(status: string): string {
  switch (status) {
  case 'created': return 'Budget Angefragt';
  case 'request_rejected': return 'Budget nicht genehmigt';
  case 'request_accepted': return 'Budget genehmigt';
  case 'file_uploaded': return 'Rechnung hochgeladen';
  case 'file_rejected': return 'Rechnung nicht angenommen';
  case 'file_accepted': return 'Finanzantrag erfolgreich bearbeitet';
  default: return '';
  }
}