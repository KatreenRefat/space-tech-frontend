import { Navigate, Route, Routes } from 'react-router-dom';

import Cover from '@/pages/auth/Cover.jsx';
import OtpVerify from '@/pages/auth/OtpVerify.jsx';
import PhoneNumber from '@/pages/auth/PhoneNumber.jsx';
import Register from '@/pages/auth/Register/Register.jsx';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Cover />} />
      {/* 'login' is kept as an alias for 'phone' — both are linked from elsewhere. */}
      <Route path="login" element={<PhoneNumber />} />
      <Route path="phone" element={<PhoneNumber />} />
      <Route path="otp" element={<OtpVerify />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
