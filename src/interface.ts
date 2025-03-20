export interface CurrencyPair {
  symbol: string;
  price: string;
}

export interface Trade {
  id: number;
  isBestMatch: boolean;
  isBuyerMaker: boolean;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
}

export interface Ticker24Hour {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}
