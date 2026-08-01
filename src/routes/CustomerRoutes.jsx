import { Routes, Route } from "react-router-dom";
import Home from "../pages/customer/Home/Home";
import Diagnosis from "../pages/customer/Diagnosis/Diagnosis";
import DiagnosisResult from "../pages/customer/DiagnosisResult/DiagnosisResult";
import Technicians from "../pages/customer/Technicians/Technicians";
import Booking from "../pages/customer/Booking/Booking";
import Tracking from "../pages/customer/Tracking/Tracking";

function CustomerRoutes() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="diagnosis" element={<Diagnosis />} />
      <Route path="diagnosis-result" element={<DiagnosisResult />} />
      <Route path="technicians" element={<Technicians />} />
      <Route path="booking" element={<Booking />} />
      <Route path="tracking" element={<Tracking />} />
    </Routes>
  );
}

export default CustomerRoutes;