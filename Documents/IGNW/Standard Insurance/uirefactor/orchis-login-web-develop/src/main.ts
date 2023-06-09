import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environment';

if (environment.production) {
  enableProdMode();
}

if (environment.env === 'prod' || environment.env === 'acc') {
  window.console.log = () => {};
  window.console.error = () => {};
  window.console.info = () => {};
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
