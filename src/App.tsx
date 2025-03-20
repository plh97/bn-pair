import moment from "moment";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Table, Thead, Tbody, Tr, Td, Select } from "@chakra-ui/react";
import {
  fetchCurrencyPair,
  fetchCurrencyPairLatestPrice,
  fetchCurrencyPair24HourPrice,
  fetchCurrencyPairRecentTrades,
} from "./Api";
import { CurrencyPair, Ticker24Hour, Trade } from "./interface";
import "./App.css";

function App() {
  const [currencyPair, setCurrencyPair] = useState<CurrencyPair[]>([]);

  const [ticker, setTicker] = useState<CurrencyPair>();
  const [ticker24h, setTicker24h] = useState<Ticker24Hour>();
  const [recentTrade, setRecentTrade] = useState<Trade[]>([]);

  useEffect(() => {
    fetchCurrencyPair().then((pair) => {
      setCurrencyPair(pair);
    });
  }, []);

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectCurrencyPair = e.target.value;
    fetchCurrencyPairLatestPrice(selectCurrencyPair).then((data) => {
      setTicker(data);
    });
    fetchCurrencyPair24HourPrice(selectCurrencyPair).then((data) => {
      setTicker24h(data);
    });
    fetchCurrencyPairRecentTrades(selectCurrencyPair).then((trades) => {
      setRecentTrade(trades);
    });
  };

  const [sort, setSort] = useState<{
    value: keyof Trade | "";
    direct: number;
  }>({
    value: "",
    direct: 0,
  });

  const sortTrade = useMemo(() => {
    if (!sort.value || sort.direct % 3 === 0) {
      return recentTrade;
    }
    return [...recentTrade].sort((tradeA: any, tradeB: any) => {
      if (sort.direct % 3 === 1) {
        return tradeB[sort.value] - tradeA[sort.value];
      }
      return tradeA[sort.value] - tradeB[sort.value];
    });
  }, [recentTrade, sort]);

  const columns = [
    {
      label: "Time",
      prop: "time",
      format: (val: string) => {
        return moment(val).format("YYYY/MM/DD hh:mm:ss");
      },
    },
    {
      label: "Price",
      prop: "price",
    },
    {
      label: "quality",
      prop: "qty",
    },
  ];

  return (
    <>
      <Select width="300px" onChange={handleChange}>
        {currencyPair.map((pair) => {
          return (
            <option label={pair.symbol} key={pair.symbol} value={pair.symbol} />
          );
        })}
      </Select>

      {ticker && (
        <>
          <h3>Ticker:</h3>
          <p>
            Symbol: {ticker?.symbol}, Price: {ticker.price}
          </p>
        </>
      )}

      {ticker24h && (
        <>
          <h3>24h ticker:</h3>
          <p>
            Highest Price: {ticker24h.highPrice}, Lowest Price:{" "}
            {ticker24h.lowPrice}, Volume: {ticker24h.volume}
          </p>
        </>
      )}

      {recentTrade.length ? (
        <Table>
          <Thead>
            <Tr>
              {columns.map((col) => {
                return (
                  <Td
                    onClick={() => {
                      setSort({
                        value: col.prop as keyof Trade,
                        direct: sort.direct + 1,
                      });
                    }}
                    key={col.prop}
                  >
                    {col.label}
                    {sort.value === col.prop && (
                      <>
                        {sort.direct % 3 === 1 ? "🔼" : null}
                        {sort.direct % 3 === 2 ? "🔽" : null}
                      </>
                    )}
                  </Td>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {sortTrade?.map((trade) => {
              return (
                <Tr key={trade.id}>
                  {columns.map((col) => {
                    return (
                      <Td key={col.prop}>
                        {col.format
                          ? col.format(trade[col.prop as keyof Trade] as string)
                          : trade[col.prop as keyof Trade]}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : null}
    </>
  );
}

export default App;
