import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinTickers } from "../api";

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const InfoWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  span {
    padding: 10px 5px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    border-radius: 10px;
  }
`;

function Price() {
  const params = useParams();
  const { coinId } = params;
  const { isLoading, data } = useQuery<PriceData>(["price", coinId], () =>
    fetchCoinTickers(coinId!)
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <InfoWrap>
          <span>Price : </span>
          <span>
            {data?.quotes.USD.price.toLocaleString("us-EN", {
              style: "currency",
              currency: "USD",
            })}
          </span>

          <span>Market Cap : </span>
          <span>{data?.quotes.USD.market_cap.toFixed(0)}</span>

          <span>Volume 24hr : </span>
          <span>{data?.quotes.USD.volume_24h.toFixed(0)}</span>
        </InfoWrap>
      )}
    </div>
  );
}

export default Price;
