import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function PhoneNumber() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // static for now — later this will call request-otp API
    navigate('/auth/otp', { state: { phone } });
  };

  return (
    <div className="auth-screen">
      <div className="logo-circle">
        <h1>صَلْخِلي</h1>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
}