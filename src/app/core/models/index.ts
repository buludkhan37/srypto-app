export type ExchangeInstrument = {
    symbol: string;
    price: number;
    volume: string;
    priceChangePercent: number;
    highPrice: number;
    lowPrice: number;
};

export type ExchangeAdapter = { url: string; parser: (data: any) => ExchangeInstrument[] };
