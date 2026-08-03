import { Routes, Route } from 'react-router-dom';
import Cover from '../Pages/auth/Login/Cover.jsx';
import PhoneNumber from '../Pages/auth/Login/PhoneNumber.jsx';
import OtpVerify from '../Pages/auth/Login/OtpVerify.jsx';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Cover />} />
      <Route path="phone" element={<PhoneNumber />} />
      <Route path="otp" element={<OtpVerify />} />
    </Routes>
  );
}