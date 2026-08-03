import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function OtpVerify() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // static for now — later this will call verify-otp API
    navigate('/home');
  };

  return (
    <div className="auth-screen">
      <div className="logo-circle">
        <h1>صَلْخِلي</h1>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[i] = el)}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>
        <button type="submit">تأكيد</button>
      </form>
    </div>
  );
}