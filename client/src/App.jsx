import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutAdmin from "./layouts/Layout";
import Dashboard from "./pages/dashboard";
import Chart from "./pages/chart";
import Setting from "./pages/setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutAdmin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chart" element={<Chart />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
