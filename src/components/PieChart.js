import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useEffect, useState } from "react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PieChart() {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("1week");

  const apiKey = "8a6946ba09d64bb19f49e3dd36b120ad"; 
  const symbol = "USD";

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
          return date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
        } else {
          return date.toLocaleDateString("en-US", { month: "long" }); // e.g., January
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

        if (data.values) {
          const labels = formatLabels(data.values, timeframe);
          const prices = data.values
            .map((entry) => parseFloat(entry.close))
            .reverse();

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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Stock Price Distribution" },
    },
  };

  return (
    <div>
      <h2>Pie Chart</h2>
      <div>
        <button onClick={() => setTimeframe("1week")}>1 Week</button>
        <button onClick={() => setTimeframe("1year")}>1 Year</button>
      </div>
      {chartData ? (
        <Pie options={options} data={chartData} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default PieChart;
