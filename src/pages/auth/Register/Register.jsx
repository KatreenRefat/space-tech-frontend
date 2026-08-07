import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '@/constants/roles.js';
import { ROUTES } from '@/constants/routes.js';
import { useGeolocation } from '@/hooks/useGeolocation.js';
import { useServiceCategories } from '@/hooks/useServiceCategories.js';
import { userService } from '@/services';

import BrandShell from '@/components/BrandShell.jsx';
import CornerBlobs from '@/components/CornerBlobs.jsx';
import InputField from '@/components/InputField.jsx';
import PendingScreen from '@/components/PendingScreen.jsx';
import UploadField from './components/UploadField.jsx';
import {
  ArrowIcon,
  ChevronDownIcon,
  IdIcon,
  PersonIcon,
  PinIcon,
  UploadIcon,
  WrenchIcon,
} from '@/components/FieldIcons.jsx';

/* ============================================================
 * تسجيل حساب جديد — POST /me/signup
 * ============================================================
 * - الطلبات كلها بتعدي على src/services، والتوكن بيتجدد تلقائيًا
 *   جوه httpClient لو رجع 401، فمش محتاجين نتعامل معاه هنا.
 * - categoryId: بييجي من GET /public/categories، ولو الـ endpoint
 *   لسه مش شغال بنستخدم قايمة احتياطية (شوف useServiceCategories).
 * - latitude/longitude: من Geolocation المتصفح (useGeolocation).
 * ============================================================ */

const initialForm = {
  fullName: '',
  city: '',
  location: '',
  role: '',
  categoryId: '',
  nationalId: '',
  personalPhoto: null,
  criminalRecord: null,
  agree: false,
};

/** بتحول أخطاء details[] الراجعة من الـ API لشكل { fieldName: message } */
function mapApiErrors(details) {
  const fieldAliases = {
    address: 'location',
    latitude: 'location',
    longitude: 'location',
    criminalRecordFile: 'criminalRecord',
    profileImage: 'personalPhoto',
  };

  return (details || []).reduce((map, detail) => {
    const key = fieldAliases[detail.field] ?? detail.field;
    map[key] = detail.message;
    return map;
  }, {});
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { coords, denied: locationDenied } = useGeolocation();
  const services = useServiceCategories();

  const isTechnician = form.role === ROLES.TECHNICIAN;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setFile = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }));

  const setRole = (role) => setForm((prev) => ({ ...prev, role }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'دخل اسمك';
    if (!form.city.trim()) next.city = 'دخل مدينتك';
    if (!form.location.trim()) next.location = 'دخل مكانك';
    if (!form.role) next.role = 'اختار دورك';

    if (isTechnician) {
      if (!form.categoryId) next.categoryId = 'اختار مجال الخدمة';
      if (!form.nationalId.trim() || form.nationalId.trim().length !== 14)
        next.nationalId = 'الرقم القومي لازم يكون 14 رقم';
    }

    if (!coords) next.location = 'محتاجين نعرف مكانك - فعّلي صلاحية الموقع في المتصفح';

    if (!form.agree) next.agree = 'لازم توافق علي سياسة الخصوصية';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildSignupPayload = () => {
    const body = new FormData();
    body.append('fullName', form.fullName.trim());
    body.append('city', form.city.trim());
    body.append('address', form.location.trim());
    body.append('latitude', String(coords.lat));
    body.append('longitude', String(coords.lng));
    body.append('role', form.role);

    if (isTechnician) {
      body.append('categoryId', form.categoryId);
      body.append('nationalId', form.nationalId.trim());
      if (form.personalPhoto) body.append('profileImage', form.personalPhoto);
      if (form.criminalRecord) body.append('criminalRecordFile', form.criminalRecord);
    }

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await userService.signup(buildSignupPayload());

      if (isTechnician) {
        // الفني بيستنى موافقة الأدمن — شاشة "معلش استنا وهنرد عليك بكرا"
        setSubmitted(true);
      } else {
        navigate(ROUTES.CUSTOMER.HOME, { replace: true });
      }
    } catch (err) {
      if (err.status === 400 && err.details?.length) {
        setErrors(mapApiErrors(err.details));
      } else if (err.status === 401) {
        // حتى الـ refreshToken خلص — لازم تسجيل دخول جديد بالكامل
        setErrors({ submit: 'انتهت صلاحية الجلسة، من فضلك سجلي دخول تاني' });
      } else if (err.status === 409) {
        setErrors({ submit: 'الحساب ده خلص تسجيله بالفعل' });
      } else {
        setErrors({ submit: err.message || 'حصل خطأ، حاول تاني' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        dir="rtl"
        className="bg-blue-light-200 font-cairo relative flex min-h-screen w-full overflow-hidden"
      >
        <CornerBlobs corners={['top-left', 'bottom-right']} />
        <div className="relative z-10 flex w-full items-center justify-center">
          <PendingScreen />
        </div>
      </div>
    );
  }

  return (
    <BrandShell corners={isTechnician ? ['top-right', 'bottom-left'] : ['top-right']}>
      <div className="w-full max-w-[490px]">
        <h1 className="text-primary-500 mb-6 text-3xl font-bold sm:text-4xl">اعمل حساب جديد</h1>

        {locationDenied && (
          <p
            className="bg-secondary-50 text-secondary-700 mb-3 rounded-lg px-3 py-2 text-xs"
            dir="rtl"
          >
            محتاجين نعرف مكانك عشان نكمل التسجيل - من فضلك فعّلي صلاحية الموقع في المتصفح وارجعي
            حدّثي الصفحة.
          </p>
        )}

        <form className="flex flex-col gap-3" dir="rtl" onSubmit={handleSubmit}>
          <InputField
            icon={PersonIcon}
            placeholder="دخل اسمك"
            value={form.fullName}
            onChange={set('fullName')}
            error={errors.fullName}
          />

          <InputField
            icon={PinIcon}
            placeholder="مدينتك"
            value={form.city}
            onChange={set('city')}
            error={errors.city}
          />

          <InputField
            icon={ArrowIcon}
            placeholder="مكانك"
            value={form.location}
            onChange={set('location')}
            error={errors.location}
          />

          {/* دورك */}
          <div>
            <span className="text-primary-800 mb-1 flex items-center gap-1.5 text-sm font-medium">
              <PersonIcon className="text-primary-500 h-4 w-4" />
              دورك
            </span>
            <div className="flex flex-row gap-3">
              <button
                type="button"
                onClick={() => setRole(ROLES.CUSTOMER)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                  form.role === ROLES.CUSTOMER
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-blue-light-700 text-primary-700 bg-white'
                }`}
              >
                عميل
              </button>
              <button
                type="button"
                onClick={() => setRole(ROLES.TECHNICIAN)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                  form.role === ROLES.TECHNICIAN
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-blue-light-700 text-primary-700 bg-white'
                }`}
              >
                فني
              </button>
            </div>
            {errors.role && <p className="text-secondary-700 mt-1 text-xs">{errors.role}</p>}
          </div>

          {/* حقول إضافية تظهر بس لو دوس على "فني" */}
          {isTechnician && (
            <>
              {/* مجال الخدمة - select (categoryId) */}
              <div>
                <div className="relative">
                  <select
                    className={`text-primary-900 focus:border-primary-500 focus:ring-primary-200 w-full appearance-none rounded-lg border bg-white py-2.5 ps-8 pe-10 text-sm transition outline-none focus:ring-2 ${
                      errors.categoryId ? 'border-secondary-500' : 'border-blue-light-700'
                    }`}
                    value={form.categoryId}
                    onChange={set('categoryId')}
                    dir="rtl"
                  >
                    <option value="">مجال الخدمة</option>
                    {services.map((service) => (
                      <option key={service.name} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <WrenchIcon className="text-primary-500 pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <ChevronDownIcon className="text-primary-400 pointer-events-none absolute start-3 top-1/2 h-3 w-3 -translate-y-1/2" />
                </div>
                {errors.categoryId && (
                  <p className="text-secondary-700 mt-1 text-xs">{errors.categoryId}</p>
                )}
              </div>

              <InputField
                icon={IdIcon}
                placeholder="دخل الرقم القومي"
                value={form.nationalId}
                onChange={set('nationalId')}
                error={errors.nationalId}
              />

              <UploadField
                icon={UploadIcon}
                label="أرفع صورة شخصية"
                hint="اقصي حجم للصورة : 2 ميجا"
                file={form.personalPhoto}
                onChange={setFile('personalPhoto')}
                error={errors.personalPhoto}
              />

              <UploadField
                icon={UploadIcon}
                label="فيش و تشبيه"
                file={form.criminalRecord}
                onChange={setFile('criminalRecord')}
                error={errors.criminalRecord}
              />
            </>
          )}

          {errors.submit && (
            <p className="text-secondary-700 text-center text-xs">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-500 hover:bg-primary-600 mt-1 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {submitting ? 'جاري الإرسال...' : 'تمام'}
          </button>

          <label className="text-primary-600 flex items-center justify-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))}
              className="border-blue-light-700 text-primary-500 focus:ring-primary-300 h-3.5 w-3.5 rounded"
            />
            أنا أوافق علي سياسة الخصوصية
          </label>
          {errors.agree && (
            <p className="text-secondary-700 -mt-2 text-center text-xs">{errors.agree}</p>
          )}
        </form>
      </div>
    </BrandShell>
  );
}
