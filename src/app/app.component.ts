import { Component } from '@angular/core';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

@Component({
    selector: 'app-root',
    imports: [ExchangeComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
