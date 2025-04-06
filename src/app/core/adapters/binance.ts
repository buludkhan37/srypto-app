import { ExchangeAdapter } from '@core/models';
import { formatValue } from '@core/utils';

const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/24hr'; // url для получения данных с binance

export const BINANCE_EXCHANGE: ExchangeAdapter = {
    url: BINANCE_API_URL,
    parser: data =>
        (data as any[]).slice(0, 1000).map(inst => ({
            symbol: inst.symbol,
            price: Number(inst.lastPrice),
            volume: formatValue(inst.volume),
            priceChangePercent: inst.priceChangePercent,
            highPrice: inst.highPrice,
            lowPrice: inst.lowPrice,
        })),
};
