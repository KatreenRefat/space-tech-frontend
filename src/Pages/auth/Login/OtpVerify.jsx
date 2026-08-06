import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './auth.css';
import {
  BigLogo,
  DecorLightning,
  DecorWrench,
  DecorScrewdriver,
  HouseLogoSmall,
} from './icons.jsx';
import lightningSvg from '../../../assets/lightning.svg';
import { authApi } from '../../../Services/api.js';

export default function OtpVerify() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get phone from state OR localStorage
  const [phone] = useState(() => {
    const fromState = location.state?.phone;
    if (fromState) {
      localStorage.setItem('otpPhone', fromState);
      console.log('Phone from navigation state:', fromState);
      return fromState;
    }
    const stored = localStorage.getItem('otpPhone') || '';
    console.log('Phone from localStorage:', stored);
    return stored;
  });

  useEffect(() => {
    if (!phone) {
      console.error('No phone number found! Redirecting...');
      navigate('/auth/phone');
      return;
    }
    inputsRef.current[0]?.focus();
  }, [phone, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('ادخل الـ 6 أرقام');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.verifyOtp(phone, otpCode);
      const { tokens, accountState, isNewUser, user } = res.data;

      // DEBUG
      console.log('=== OTP VERIFY RESULT ===');
      console.log('isNewUser:', isNewUser);
      console.log('accountState:', accountState);
      console.log('role:', user?.role);
      console.log('=========================');

      // Save tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('tokenType', tokens.tokenType);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('otpPhone');

      // ===== CORRECTED ROUTING =====
      if (isNewUser === true) {
        // Brand new phone number → create account
        navigate('/auth/register');
      } else {
        // EXISTING USER → go to role dashboard directly
        // (ignore accountState for existing users)
        if (user?.role === 'CUSTOMER') {
          navigate('/customer');
        } else if (user?.role === 'TECHNICIAN') {
          navigate('/technician');
        } else if (user?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      }
    } catch (err) {
      console.error('Verify OTP failed:', err);

      if (err.status === 400) {
        const backendMsg = err.data?.error?.message;
        const backendDetail = err.data?.error?.details?.[0]?.message;
        setError(backendDetail || backendMsg || 'الكود غلط أو الرقم مش متطابق');
      } else if (err.status === 429) {
        setError('جربت كتير، استنى شوية');
      } else {
        setError(err.message || 'حصل خطأ، جرب تاني');
      }
    } finally {
      setLoading(false);
    }
  };
  // For testing: show phone being used
  const maskPhone = (p) => {
    if (!p) return '';
    return p.slice(0, 4) + '****' + p.slice(-3);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-blob tr" />
      <div className="auth-bg-blob bl" />

      <div className="auth-topbar">
        <HouseLogoSmall />
        <span>صَلْخِلي</span>
      </div>

      <div className="auth-split">
        <div className="auth-split-left">
          <div className="split-logo-wrapper">
            <BigLogo />
            <DecorLightning />
            <DecorWrench />
            <DecorScrewdriver />
          </div>
        </div>

        <div className="auth-split-right">
          <div className="auth-form-container">
            <div className="auth-greeting">
              <img src={lightningSvg} alt="" className="greeting-icon" />
              <span>دخل الرمز 😊</span>
            </div>
            <p className="auth-subtext">
              قدمنا نسهلها عليك
              <br />
              اتبع الخطوات من فضلك
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              رقم التليفون: {maskPhone(phone)}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'جاري التحقق...' : 'تمام'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}