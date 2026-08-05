import { Routes, Route } from 'react-router-dom';
import Cover from '../Pages/auth/Login/Cover.jsx';
import PhoneNumber from '../Pages/auth/Login/PhoneNumber.jsx';
import OtpVerify from '../Pages/auth/Login/OtpVerify.jsx';

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Cover />} />
      <Route path="login" element={<PhoneNumber />} />
      <Route path="phone" element={<PhoneNumber />} />
      <Route path="otp" element={<OtpVerify />} />
      {/* TODO: your friend will replace this div with Register.jsx */}
      <Route
        path="register"
        element={
          <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Cairo' }}>
            <h1>صفحة التسجيل</h1>
            <p>تحت الإنشاء — your friend works here</p>
          </div>
        }
      />
    </Routes>
  );
}