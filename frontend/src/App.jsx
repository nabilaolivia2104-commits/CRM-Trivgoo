import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardHome";
import Leads from "./pages/Leads";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login"; // <-- betul, dari pages/Login.jsx
import "./index.css";
import Clients from "./pages/clients/Clients";
import DashboardHome from "./pages/DashboardHome";
import DashboardLayout from "./pages/DahsboardLayout";
import AddClient from "./pages/clients/AddClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditClient from "./pages/clients/Editclient";
import Sales from "./pages/sales/sales";
import AddSales from "./pages/sales/AddSales";
import EditSales from "./pages/sales/EditSales";
import Proposal from "./pages/proposal/proposal";
import DetailProposal from "./pages/proposal/DetailProposal";
import EditProposal from "./pages/proposal/EditProposal";
import AddProposal from "./pages/proposal/AddProposal";
import Deals from "./pages/deal/Deals";
import AddDeals from "./pages/deal/AddDeals";
import EditDeals from "./pages/deal/EditDeals";

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/add" element={<AddClient />} />
            <Route path="clients/:id/edit" element={<EditClient />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales/add" element={<AddSales />} />
            <Route path="sales/:id/edit" element={<EditSales />} />
            <Route path="proposal" element={<Proposal />} />
            <Route path="proposal/add" element={<AddProposal />} />
            <Route path="proposal/:id/detail" element={<DetailProposal />} />
            <Route path="proposal/:id/edit" element={<EditProposal />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/add" element={<AddDeals />} />
            <Route path="deals/:id/edit" element={<EditDeals />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
