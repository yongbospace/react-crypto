import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinPrice } from "../api";

const InfoWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  span {
    padding: 10px 5px;
    background-color: ${(prop) => prop.theme.cardBgColor};
    border: 1px solid white;
    text-align: center;
    border-radius: 10px;
  }
`;

interface IPrice {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

function Price() {
  const params = useParams();
  const { coinId } = params;
  const { isLoading, data } = useQuery<IPrice[]>(["price", coinId], () =>
    fetchCoinPrice(coinId!)
  );
  const coinPrice: any = data ? data[0] : {};
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <InfoWrap>
          <span>Open</span>
          <span>
            US${" "}
            {coinPrice.open.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          <span>Close</span>
          <span>
            US${" "}
            {coinPrice.close.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          <span>High</span>
          <span>
            US${" "}
            {coinPrice.high.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || {}}
          </span>

          <span>Low</span>
          <span>
            US${" "}
            {coinPrice.low.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </InfoWrap>
      )}
    </div>
  );
}

export default Price;
