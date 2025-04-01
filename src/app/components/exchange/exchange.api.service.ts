import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject, startWith, exhaustMap, of, concatWith, delay, endWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ExchangeInstrument = {
    symbol: string;
    price: number;
    volume: string;
    priceChangePercent: number;
    highPrice: number;
    lowPrice: number;
};

function formatValue(volume: string): string {
    const num = parseInt(volume);

    if (num > 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num > 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num > 1e3) return (num / 1e3).toFixed(1) + 'K';

    return num.toFixed(1);
}

const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/24hr'; // url для получения данных с binance

type State = {
    data: ExchangeInstrument[];
    loading: boolean;
};

const INITIAL_VALUE: State = {
    data: [],
    loading: false,
};

@Injectable({
    providedIn: 'root',
})
export class ExchangeApiService {
    #state = signal(INITIAL_VALUE);
    state = this.#state.asReadonly();
    #httpClient = inject(HttpClient);
    #reload = new Subject<void>();

    constructor() {
        this.#initInstrumentsObserving();
    }

    reload() {
        this.#reload.next();
    }

    #initInstrumentsObserving() {
        this.#reload
            .asObservable()
            .pipe(
                startWith(void 0),
                exhaustMap(() =>
                    of({ loading: true }).pipe(
                        concatWith(
                            this.#httpClient.get<any[]>(BINANCE_API_URL).pipe(
                                delay(1000),
                                map(data => ({
                                    data: data.slice(0, 1000).map(inst => ({
                                        symbol: inst.symbol,
                                        price: Number(inst.lastPrice),
                                        volume: formatValue(inst.volume),
                                        priceChangePercent: inst.priceChangePercent,
                                        highPrice: inst.highPrice,
                                        lowPrice: inst.lowPrice,
                                    })),
                                })),
                            ),
                        ),
                        endWith({ loading: false }),
                    ),
                ),
                takeUntilDestroyed(),
            )
            .subscribe(value => this.#state.update(state => ({ ...state, ...value })));
    }
}
