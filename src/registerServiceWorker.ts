import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);
    // wb.addEventListener('controlling', () => {
    //    // would reload page here
    // });
    wb.addEventListener('waiting', () => {
      wb?.messageSkipWaiting();
    });

    wb.register();
  }
}
export default wb;