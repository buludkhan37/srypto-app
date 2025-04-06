import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { utc } from '@date-fns/utc';
import { sortBy, prop } from 'remeda';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EXCHANGE_TOKEN } from '@core/tokens';
import { httpResource } from '@angular/common/http';
import { ExchangeInstrument } from '@core/models';
import { BINANCE_EXCHANGE } from '@core/adapters';

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
    providers: [{ provide: EXCHANGE_TOKEN, useValue: BINANCE_EXCHANGE }],
    templateUrl: './exchange.component.html',
    styleUrl: './exchange.component.scss',
})
export class ExchangeComponent {
    exchanges = ['Binance', 'ByBit', 'OKX'];
    selectedExchange = 'Binance';
    #exchange = inject(EXCHANGE_TOKEN);

    utcEnabled = signal(false);
    now = new Date();
    utcDate = utc(this.now);
    showTime = computed(() => (this.utcEnabled() ? this.utcDate : this.now));
    filter = model('');
    priceSort = signal<direction>(null);

    dataResource = httpResource<ExchangeInstrument[]>(
        { url: this.#exchange.url },
        {
            defaultValue: <ExchangeInstrument[]>[],
            parse: this.#exchange.parser,
        },
    );

    filteredData = computed(() => {
        const data = this.dataResource.value();
        const filter = this.filter();
        const priceSort = this.priceSort();
        const filteredData = data.filter(item =>
            item.symbol.toLowerCase().includes(filter.toLowerCase()),
        );
        return priceSort ? sortBy(filteredData, [prop('price'), priceSort]) : filteredData;
    });

    handlePriceSort() {
        this.priceSort.update(dir => (dir === 'asc' ? 'desc' : dir === 'desc' ? null : 'asc'));
    }
}
