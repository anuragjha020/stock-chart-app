import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Register required ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("1month"); // Default: 1 Month

  const apiKey = "8a6946ba09d64bb19f49e3dd36b120ad"; // Replace with your API key
  const symbol = "AAPL"; // Example stock symbol

  // Function to determine interval and output size
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
          return date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday
        } else if(timeframe === "1month"){
          return date.getDate(); // e.g., January
        } else{
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
        console.log("Bar Chart Data: ", data);

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
                backgroundColor: "rgba(99, 255, 132, 0.5)",
                borderColor: "rgba(99, 255, 132, 1)",
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
      title: { display: true, text: "Stock Price Over Time" },
    },
  };

  return (
    <div>
      <h2>Bar Chart</h2>
      <div>
        <button onClick={() => setTimeframe("1week")}>1 Week</button>
        <button onClick={() => setTimeframe("1month")}>1 Month</button>
        <button onClick={() => setTimeframe("1year")}>1 Year</button>
      </div>
      {chartData ? (
        <Bar options={options} data={chartData} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default BarChart;
