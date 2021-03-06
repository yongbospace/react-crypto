import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import {
  useLocation,
  useParams,
  Link,
  useMatch,
  Routes,
  Route,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    border-radius: 7px;
    text-transform: uppercase;
    background-color: ${(prop) => prop.theme.cardBgColor};
    color: ${(prop) => prop.theme.textColor};
    border: 1px solid white;
    width: 40px;
    height: 40px;
  }
`;
const Logo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 5px;
`;
const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${(props) => props.theme.accentColor};
`;
const ModeSwitch = styled.button`
  position: absolute;
  right: 0px;
`;
const Home = styled.button`
  position: absolute;
  left: 0px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
  color: ${(props) => props.theme.textColor};
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(prop) => prop.theme.cardBgColor};
  border: 1px solid white;
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Taps = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;
  gap: 10px;
  margin-bottom: 20px;
`;
const Tap = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(prop) => prop.theme.cardBgColor};
  border: 1px solid white;
  padding: 7px 0px;
  border-radius: 10px;

  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteState {
  state: { name: string };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

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

function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const isDark = useRecoilValue(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId!),
    {
      refetchInterval: 1000,
    }
  );
  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading.." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Home>
          <Link to="/">
            <span>HOME</span>
          </Link>
        </Home>
        <Logo src={`https://cryptocurrencyliveprices.com/img/${coinId}.png`} />
        <Title
          style={
            isDark
              ? {
                  textShadow: "6px 6px 4px #1e272e",
                }
              : { textShadow: "3px 3px 2px #d2dae2" }
          }
        >
          {state?.name ? state.name : loading ? "Loading.." : infoData?.name}
        </Title>
        <ModeSwitch onClick={toggleDarkAtom}>
          <span>{isDark ? "Light" : "Dark"}</span>
          <span>Mode</span>
        </ModeSwitch>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>
                {tickersData?.quotes.USD.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Taps>
            <Tap isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tap>
            <Tap isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tap>
          </Taps>
        </>
      )}
      <Routes>
        <Route path="chart" element={<Chart />} />
        <Route path="price" element={<Price />} />
      </Routes>
    </Container>
  );
}

export default Coin;
