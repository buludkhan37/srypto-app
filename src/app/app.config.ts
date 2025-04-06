import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        { provide: LOCALE_ID, useValue: 'ru-RU' },
        {
            provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
            useValue: {
                tooltipClass: 'custom-tooltip',
            },
        },
    ],
};
