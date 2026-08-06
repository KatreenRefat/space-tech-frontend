import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { normalizePhone, isValidPhone } from '../../../utils/phone.js';

export default function PhoneNumber() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double submit

    setError('');
    const formatted = normalizePhone(phone);

    if (!isValidPhone(phone)) {
      setError('رقم التليفون مش مظبوط. جرب: 01012345678 أو +201012345678');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.requestOtp(formatted);

      if (res.data?.devOtpCode) {
        console.log('✅ Dev OTP Code:', res.data.devOtpCode);
      }

      // Store phone so OTP page survives refresh
      localStorage.setItem('otpPhone', formatted);
      navigate('/auth/otp', { state: { phone: formatted } });
    } catch (err) {
      console.error('OTP request failed:', err);

      if (err.status === 429) {
        setError('طلبت كود كتير، استنى دقيقة وجرب تاني');
      } else if (err.status === 400) {
        const detail = err.data?.error?.details?.[0]?.message;
        setError(detail || 'رقم التليفون غلط، اتأكد منه');
      } else {
        setError(err.data?.error?.message || 'حصل خطأ، جرب تاني');
      }
    } finally {
      setLoading(false);
    }
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
              <span>صباح الفل!</span>
            </div>
            <p className="auth-subtext">
              قدمنا نسهلها عليك
              <br />
              اتبع الخطوات من فضلك
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder="مثال: 01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="auth-input"
                disabled={loading}
                dir="rtl"
              />
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'جاري الإرسال...' : 'تمام'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}