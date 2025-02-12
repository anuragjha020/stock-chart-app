import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PieChart() {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("1week");
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPrice, setMinPrice] = useState(null);

  const apiKey = "8a6946ba09d64bb19f49e3dd36b120ad";
  const symbol = "AAPL";

  // Function to determine interval and output size
  const getIntervalAndSize = (timeframe) => {
    switch (timeframe) {
      case "1week":
        return { interval: "1day", outputSize: "7" }; // Last 7 days
      case "1year":
        return { interval: "1month", outputSize: "12" }; // Last 12 months
      default:
        return { interval: "1day", outputSize: "7" };
    }
  };

  // Convert datetime to weekday or month name
  const formatLabels = (data, timeframe) => {
    return data
      .map((entry) => {
        const date = new Date(entry.datetime);
        if (timeframe === "1week") {
          return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
        } else {
          return date.toLocaleDateString("en-US", { month: "short" });
        }
      })
      .reverse();
  };

  useEffect(() => {
    const fetchStockData = async () => {
      const { interval, outputSize } = getIntervalAndSize(timeframe);

      try {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputSize}&apikey=${apiKey}`
        );
        const data = await response.json();
        console.log("Pie Chart Data: ", data);

        if (data) {
          const labels = formatLabels(data.values, timeframe);
          const prices = data.values
            .map((entry) => parseFloat(entry.close))
            .reverse();

          const maxPrice = Math.max(...prices).toFixed(2);
          setMaxPrice(maxPrice);

          const minPrice = Math.min(...prices).toFixed(2);
          setMinPrice(minPrice);

          setChartData({
            labels,
            datasets: [
              {
                label: `${symbol} Stock Price`,
                data: prices,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#C9CBCF",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                ],
                borderColor: "#FFFFFF",
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
          Week
        </button>
        <button
          className={`btn btn-sm btn-outline-secondary ${
            timeframe === "1year" ? "active" : ""
          }`}
          onClick={() => setTimeframe("1year")}
        >
          Year
        </button>
      </div>
      {chartData ? (
        <>
          <Pie data={chartData} />
          {(maxPrice !== null || minPrice !== null) && (
            <div className="alert alert-info text-center p-3 mt-4 rounded shadow">
              {maxPrice !== null && (
                <p className="mb-1">
                  📈 <strong>Highest Price</strong>
                  {timeframe === "1year" ? " of this year " : " of this week "}
                  is <strong className="text-success">{maxPrice}</strong>
                </p>
              )}

              {minPrice !== null && (
                <p className="mb-0">
                  📉 <strong>Lowest Price</strong>
                  {timeframe === "1year" ? " of this year " : " of this week "}
                  is <strong className="text-danger">{minPrice}</strong>
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default PieChart;
