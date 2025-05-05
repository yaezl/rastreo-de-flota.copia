self.addEventListener('install', event => {
    console.log('SW instalado');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('SW activado');
  });
  
  self.addEventListener('fetch', event => {
    // Permite que todo pase por el navegador normalmente
  });
  
 