import { Navigate, Route, Routes } from 'react-router-dom';

import CustomerLayout from '@/layouts/CustomerLayout.jsx';
import Booking from '@/pages/customer/Booking.jsx';
import Diagnosis from '@/pages/customer/Diagnosis.jsx';
import DiagnosisResult from '@/pages/customer/DiagnosisResult.jsx';
import Home from '@/pages/customer/Home.jsx';
import SolveMethod from '@/pages/customer/SolveMethod.jsx';
import Technicians from '@/pages/customer/Technicians.jsx';
import Tracking from '@/pages/customer/Tracking.jsx';

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        {/* /customer on its own used to render nothing at all. */}
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="solve-method" element={<SolveMethod />} />
        <Route path="diagnosis" element={<Diagnosis />} />
        <Route path="diagnosis-result" element={<DiagnosisResult />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="booking" element={<Booking />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>
    </Routes>
  );
}
