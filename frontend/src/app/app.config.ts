import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';

const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env['CLIENT_ID'] || '1015469568453-9nn06di467gg90dna5bnt6famvdg1p4b.apps.googleusercontent.com';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'AuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(CLIENT_ID)
          }
        ]
      } as unknown as AuthServiceConfig
    }
  ]
};