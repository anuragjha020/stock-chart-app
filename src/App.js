import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-4">
      <h1>Stock Chart App</h1>
      <div className="row">
        {/* Pie chart on the left side */}
        <div className="col-md-4">
          <PieChart />
        </div>

        {/* Line chart and Bar chart on the right side, vertically stacked */}
        <div className="col-md-8">
          <div className="row">
            <div className="col-12 mb-4">
              <LineChart />
            </div>
            <div className="col-12">
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
