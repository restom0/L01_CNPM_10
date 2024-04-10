import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutAdmin from "./layouts/Layout";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutAdmin />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="printerAdmin" element={<PrinterAdmin />} />
          <Route path="paperAdmin" element={<PaperAdmin />} />
          <Route path="infoAdmin" element={<InfoAdmin />} />
          <Route path="PrinterStatistics" element={<PrinterStatistics />} />
          <Route path="RevenueStatistics" element={<RevenueStatistics />} /> */}
        </Route>
        {/* <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="print" element={<Print />} />
          <Route path='print/ChoosePrinter' element={< ChoosePrinter/>} />
          <Route path='history' element={< History/>}/>
          <Route path="shared" >
            <Route index element={<Shared />} />
            <Route path="detail/:id" element={<Detail />} />
          </Route>
          <Route path="buy" element={<Buy />} />
          <Route path="buy/paymentcheck" element={<PaymentCheck />} />
        </Route>
        <Route path="*" element={<Error />} /> */}
      </Routes>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logojkkjdakjakjsakaskjsdaaaaaaa"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <h1 className="text-9xl font-bold underline">Hello world!</h1> */}
    </Router>
  );
}

export default App;
