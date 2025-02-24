import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
// Instead of HttpClientModule:
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Provide the new standalone HTTP API:
    provideHttpClient(),   // <-- This is the new recommended approach

    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule
      // Notice: we removed HttpClientModule from here
    )
  ]
};
