import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

var isLoading = true;
window.addEventListener('load', () => {
  isLoading = false;
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
