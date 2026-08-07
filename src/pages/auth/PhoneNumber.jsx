import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BrandShell from '@/components/BrandShell.jsx';
import InputField from '@/components/InputField.jsx';
import PrimaryButton from '@/components/PrimaryButton.jsx';
import { PhoneIcon } from '@/components/FieldIcons.jsx';
import { authService } from '@/services';
import { ROUTES } from '@/constants/routes.js';
import { saveOtpPhone } from '@/utils/storage.js';
import { normalizePhone, isValidPhone } from '@/utils/phone.js';

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
      const res = await authService.requestOtp(formatted);

      if (res.data?.devOtpCode) {
        console.log('✅ Dev OTP Code:', res.data.devOtpCode);
      }

      // Store phone so OTP page survives refresh
      saveOtpPhone(formatted);
      navigate(ROUTES.AUTH.OTP, { state: { phone: formatted } });
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
    <BrandShell corners={['bottom-right']}>
      <div className="w-full max-w-[420px]">
        <h1 className="text-primary-500 text-4xl font-bold sm:text-5xl">صباح الفل !</h1>
        <p className="text-primary-400 mt-4 text-sm leading-7">
          هدفنا نسهلها عليك
          <br />
          اتبع الخطوات من فضلك
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <InputField
            icon={PhoneIcon}
            type="tel"
            placeholder="دخل رقمك"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error}
          />
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'تمام'}
          </PrimaryButton>
        </form>
      </div>
    </BrandShell>
  );
}
