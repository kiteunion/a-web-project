import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import {definePreset} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
  //Your customizations, see the following sections for examples
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      // registering interceptors
      // withInterceptors([authInterceptor])
    ),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.light-theme',
          cssLayer: false
        },
        // ripple: true
      }
    }),
    MessageService,
    importProvidersFrom(ConfirmationService),
    importProvidersFrom(DatePipe),
    importProvidersFrom(CurrencyPipe),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(AnimateOnScrollModule),
    importProvidersFrom(BrowserAnimationsModule),
  ]
};
