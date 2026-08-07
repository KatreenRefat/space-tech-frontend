import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import BrandShell from '@/components/BrandShell.jsx';
import PrimaryButton from '@/components/PrimaryButton.jsx';
import { authService } from '@/services';
import { HOME_ROUTE_BY_ROLE, ROUTES } from '@/constants/routes.js';
import { clearOtpPhone, getOtpPhone, saveOtpPhone, saveTokens, saveUser } from '@/utils/storage.js';

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
      saveOtpPhone(fromState);
      return fromState;
    }
    return getOtpPhone() || '';
  });

  useEffect(() => {
    if (!phone) {
      navigate(ROUTES.AUTH.PHONE, { replace: true });
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
      const res = await authService.verifyOtp(phone, otpCode);
      const { tokens, isNewUser, user } = res.data;

      saveTokens(tokens);
      saveUser(user);
      clearOtpPhone();

      if (isNewUser === true) {
        // Brand new phone number → finish creating the account
        navigate(ROUTES.AUTH.REGISTER, { replace: true });
        return;
      }

      // Existing user → straight to their dashboard. Unknown roles fall back to
      // the customer side rather than a route that doesn't exist.
      navigate(HOME_ROUTE_BY_ROLE[user?.role] ?? ROUTES.CUSTOMER.HOME, { replace: true });
    } catch (err) {
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

  return (
    <BrandShell corners={['bottom-right']}>
      <div className="w-full max-w-[420px]">
        <h1 className="text-primary-500 text-4xl font-bold sm:text-5xl">دخل الرمز 😊</h1>
        <p className="text-primary-400 mt-4 text-sm leading-7">
          هدفنا نسهلها عليك
          <br />
          اتبع الخطوات من فضلك
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* الخانات بتتكتب من الشمال لليمين زي الأرقام نفسها. */}
          <div className="flex justify-center gap-2.5" dir="ltr">
            {otp.map((digit, i) => (
              <input
                key={i}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={loading}
                className="border-blue-light-700 text-primary-900 focus:border-primary-500 focus:ring-primary-200 h-12 w-11 rounded-lg border bg-white text-center text-lg font-bold outline-none focus:ring-2"
              />
            ))}
          </div>

          {error && (
            <p className="text-secondary-700 text-center text-xs" dir="rtl">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'جاري التحقق...' : 'تمام'}
          </PrimaryButton>
        </form>
      </div>
    </BrandShell>
  );
}
