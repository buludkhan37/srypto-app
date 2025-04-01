import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { utc } from '@date-fns/utc';
import { ExchangeApiService } from './exchange.api.service';
import { sortBy, prop } from 'remeda';
import { MatTooltipModule } from '@angular/material/tooltip';

type direction = 'asc' | 'desc' | null;

@Component({
    selector: 'app-exchange',
    imports: [
        FormsModule,
        ScrollingModule,
        NgTemplateOutlet,
        NgClass,
        DecimalPipe,
        DatePipe,
        MatTooltipModule,
    ],
    templateUrl: './exchange.component.html',
    styleUrl: './exchange.component.scss',
})
export class ExchangeComponent {
    exchanges = ['Binance', 'ByBit', 'OKX'];
    selectedExchange = 'Binance';

    utcEnabled = signal(false);
    now = new Date();
    utcDate = utc(this.now);
    showTime = computed(() => (this.utcEnabled() ? this.utcDate : this.now));
    filter = model('');
    priceSort = signal<direction>(null);

    api = inject(ExchangeApiService);
    filteredData = computed(() => {
        const data = this.api.state().data;
        const filter = this.filter();
        const priceSort = this.priceSort();
        const filteredData = data.filter(item =>
            item.symbol.toLowerCase().includes(filter.toLowerCase()),
        );
        return priceSort ? sortBy(filteredData, [prop('price'), priceSort]) : filteredData;
    });

    loading = computed(() => this.api.state().loading);

    handlePriceSort() {
        this.priceSort.update(dir => (dir === 'asc' ? 'desc' : dir === 'desc' ? null : 'asc'));
    }
}
