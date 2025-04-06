import { InjectionToken } from '@angular/core';
import { ExchangeAdapter } from '@core/models';

export const EXCHANGE_TOKEN = new InjectionToken<ExchangeAdapter>('EXCHANGE_TOKEN');
