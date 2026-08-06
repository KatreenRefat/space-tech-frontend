import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Customer/Home/Home";
import Diagnosis from "../Pages/Customer/Diagnosis/Diagnosis";
import DiagnosisResult from "../Pages/Customer/DiagnosisResult/DiagnosisResult";
import Technicians from "../Pages/Customer/Technicians/Technicians";
import Booking from "../Pages/Customer/Booking/Booking";
import Tracking from "../Pages/Customer/Tracking/Tracking";

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