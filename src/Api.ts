import axios, { AxiosRequestConfig } from "axios";
import { CurrencyPair, Ticker24Hour, Trade } from "./interface";

const instance = axios.create({
  //   withCredentials: true,
  baseURL: "https://api.binance.com/api",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default function request<T = unknown>(option: AxiosRequestConfig) {
  return new Promise<T>((resolve, reject) => {
    instance
      .request<T>(option)
      .then((res) => resolve(res as T))
      .catch((err) => reject(err));
  });
}

export const fetchCurrencyPair = async (): Promise<CurrencyPair[]> => {
  return request({
    url: "/v3/ticker/price",
  });
};

// get latest price (Ticker)
export const fetchCurrencyPairLatestPrice = async (
  pair: string
): Promise<CurrencyPair> => {
  return request({
    url: "/v3/ticker/price",
    params: {
      symbol: pair,
    },
  });
};

// get 24 hours price (Ticker)
export const fetchCurrencyPair24HourPrice = async (
  pair: string
): Promise<Ticker24Hour> => {
  return request({
    url: "/v3/ticker/24hr",
    params: {
      symbol: pair,
    },
  });
};


// 获取近期交易 (Recent Trades)
export const fetchCurrencyPairRecentTrades = async (
  pair: string
): Promise<Trade[]> => {
  return request({
    url: "/v3/trades",
    params: {
      symbol: pair,
      limit: 5,
    },
  });
};
