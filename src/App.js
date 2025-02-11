import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-5 ">
      {/* App Heading */}
      <h1 className="text-center mb-5 font-weight-bold text-white bg-primary p-4 rounded">
        Stock Chart App
      </h1>

      {/* Row for Bar and Line Charts */}
      <div className="row mb-5">
        <div className="col-md-6 ">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Bar Chart</h4>
              <BarChart />
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Line Chart</h4>
              <LineChart />
            </div>
          </div>
        </div>
      </div>

      {/* Row for Pie Chart */}
      <div className="row mb-3 justify-content-center">
        <div className="col-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Pie Chart</h4>
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
