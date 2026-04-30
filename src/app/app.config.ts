import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient ,withInterceptors} from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth.interceptors';
import { provideAnimations } from '@angular/platform-browser/animations';
import { mockApiInterceptor } from '@core/interceptors/mock-api.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes , withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor,mockApiInterceptor])),
    provideAnimations(),
  ],
};
