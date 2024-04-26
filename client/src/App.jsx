import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutAdmin from "./layouts/Layout";
import Dashboard from "./pages/dashboard";
import Chart from "./pages/chart";
import Setting from "./pages/setting";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Log from "./pages/log";
import User from "./pages/user";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
        <Route path="/" element={<LayoutAdmin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chart" element={<Chart />} />
          <Route path="setting" element={<Setting />} />
          <Route path="log" element={<Log />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App