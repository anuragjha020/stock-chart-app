import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart() {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("1week");
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPrice, setMinPrice] = useState(null);

  const apiKey = "8a6946ba09d64bb19f49e3dd36b120ad";
  const symbol = "AAPL";

  // Function to get interval and output size based on timeframe
  const getIntervalAndSize = (timeframe) => {
    switch (timeframe) {
      case "1week":
        return { interval: "1day", outputSize: "7" }; // Last 7 days
      case "1month":
        return { interval: "1day", outputSize: "30" }; // Last 30 days
      case "1year":
        return { interval: "1month", outputSize: "12" }; // Last 12 months
      default:
        return { interval: "1day", outputSize: "30" }; // Default: 1 month
    }
  };

  // Convert datetime to weekday or month name
  const formatLabels = (data, timeframe) => {
    return data
      .map((entry) => {
        const date = new Date(entry.datetime);
        if (timeframe === "1week") {
          return date.toLocaleDateString("en-US", { weekday: "long" });
        } else if (timeframe === "1month") {
          return date.getDate();
        } else {
          return date.toLocaleDateString("en-US", { month: "long" });
        }
      })
      .reverse();
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const { interval, outputSize } = getIntervalAndSize(timeframe);
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputSize}&apikey=${apiKey}`
        );
        const data = (await response.json()).values;

        if (data) {
          const labels = formatLabels(data, timeframe);
          const UpPrices = data
            .map((entry) => parseFloat(entry.high))
            .reverse();
          const LowPrices = data
            .map((entry) => parseFloat(entry.low))
            .reverse();

          const maxPrice = Math.max(...UpPrices).toFixed(2);
          setMaxPrice(maxPrice);
          const minPrice = Math.min(...LowPrices).toFixed(2);
          setMinPrice(minPrice);

          setChartData({
            labels,
            datasets: [
              {
                label: `${symbol} High Price`,
                data: UpPrices,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
              {
                label: `${symbol} Low Price`,
                data: LowPrices,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, [timeframe]);

  return (
    <div>
      <div className="btn-group" role="group" aria-label="Timeframe Selector">
        <button
          className={`btn btn-sm btn-outline-secondary ${
            timeframe === "1week" ? "active" : ""
          }`}
          onClick={() => setTimeframe("1week")}
        >
          1 Week
        </button>
        <button
          className={`btn btn-sm btn-outline-secondary ${
            timeframe === "1month" ? "active" : ""
          }`}
          onClick={() => setTimeframe("1month")}
        >
          1 Month
        </button>
        <button
          className={`btn btn-sm btn-outline-secondary ${
            timeframe === "1year" ? "active" : ""
          }`}
          onClick={() => setTimeframe("1year")}
        >
          1 Year
        </button>
      </div>
      {chartData ? (
        <>
          <Line data={chartData} />
          {(maxPrice !== null || minPrice !== null) && (
            <div className="alert alert-info text-center p-3 mt-4 rounded shadow">
              {maxPrice !== null && (
                <p className="mb-1">
                  📈 <strong>Highest Price</strong>
                  {timeframe === "1year"
                    ? " of this year "
                    : timeframe === "1month"
                    ? " of this month "
                    : " of this week "}
                  is <strong className="text-success">{maxPrice}</strong>
                </p>
              )}

              {minPrice !== null && (
                <p className="mb-0">
                  📉 <strong>Lowest Price</strong>
                  {timeframe === "1year"
                    ? " of this year "
                    : timeframe === "1month"
                    ? " of this month "
                    : " of this week "}
                  is <strong className="text-danger">{minPrice}</strong>
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default LineChart;
