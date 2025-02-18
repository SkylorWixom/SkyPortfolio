import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';            // <-- (A) Add import here
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1) Speed up zone-based detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2) Provide the router with your route definitions
    provideRouter(routes),

    // 3) Provide Angular forms support (Template-driven + Reactive) + HTTP
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule                                       // <-- (B) Include in importProvidersFrom
    )
  ]
};
