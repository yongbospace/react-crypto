import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface iHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const params = useParams();
  const { coinId } = params;
  const { isLoading, data } = useQuery<iHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId!),
    {
      refetchInterval: 1000,
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data:
                data?.map((price) => {
                  return {
                    x: price.time_close.slice(5, 10),
                    y: [
                      price.open.toFixed(2),
                      price.high.toFixed(2),
                      price.low.toFixed(2),
                      price.close.toFixed(2),
                    ],
                  };
                }) ?? [],
            },
          ]}
          options={{
            theme: { mode: isDark ? "dark" : "light" },
            chart: {
              toolbar: { show: false },
              background: "transparent",
            },
            stroke: {
              curve: "smooth",
              width: 1,
            },
            grid: { show: true },
            yaxis: { show: true },
            xaxis: {
              labels: {
                show: true,
              },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#ff3f34",
                  downward: "#0fbcf9",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
