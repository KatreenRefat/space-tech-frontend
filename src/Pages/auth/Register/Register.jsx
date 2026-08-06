import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import wrenchIcon from "../../../assets/icons/wrench.svg";
import screwdriverIcon from "../../../assets/icons/screwdriver.svg";
import lightningIcon from "../../../assets/icons/lightning.svg";

/* ============================================================
 * API Config
 * ============================================================ */
const API_BASE = "";
const SIGNUP_ENDPOINT = `${API_BASE}/api/v1/me/signup`;
const CATEGORIES_ENDPOINT = `${API_BASE}/api/v1/public/categories`;
const REFRESH_ENDPOINT = `${API_BASE}/api/v1/public/auth/refresh`;

const FALLBACK_SERVICES = [
  { id: "plumbing", name: "سباكة" },
  { id: "electricity", name: "كهرباء" },
  { id: "carpentry", name: "نجارة" },
  { id: "painting", name: "دهانات" },
  { id: "hvac", name: "تكييف وتبريد" },
];

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  const type = localStorage.getItem("tokenType") || "Bearer";
  return token ? { Authorization: `${type} ${token}` } : {};
}

function saveTokens(tokens) {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem("tokenType", tokens.tokenType || "Bearer");
}

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  try {
    const res = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (!json?.data?.tokens) return false;
    saveTokens(json.data.tokens);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithAuth(url, options = {}) {
  const doFetch = () =>
    fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), ...getAuthHeader() },
    });
  let res = await doFetch();
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) res = await doFetch();
  }
  return res;
}

function mapApiErrors(details) {
  const map = {};
  (details || []).forEach((d) => {
    const key =
      d.field === "address" || d.field === "latitude" || d.field === "longitude"
        ? "location"
        : d.field === "criminalRecordFile"
        ? "criminalRecord"
        : d.field === "profileImage"
        ? "personalPhoto"
        : d.field;
    map[key] = d.message;
  });
  return map;
}

const ROLES = { CUSTOMER: "CUSTOMER", TECHNICIAN: "TECHNICIAN" };

const initialForm = {
  fullName: "",
  city: "",
  location: "",
  role: "",
  categoryId: "",
  nationalId: "",
  personalPhoto: null,
  criminalRecord: null,
  agree: false,
};

/* ============================================================
 * Inline Icons
 * ============================================================ */
const PersonIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z"/></svg>
);
const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"/></svg>
);
const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="m3 11 18-8-8 18-2-8-8-2Z"/></svg>
);
const WrenchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22 6.5a4.5 4.5 0 0 1-6.4 4.1L8 18.2a2 2 0 1 1-2.8-2.8l7.6-7.6A4.5 4.5 0 1 1 22 6.5Z"/></svg>
);
const IdIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm4 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2Zm-3.5 8a3.5 3.5 0 0 1 7 0Zm9-6h7v1.5h-7Zm0 3h7V16h-7Z"/></svg>
);
const UploadIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 3 7 8h3v7h4V8h3ZM5 19h14v2H5Z"/></svg>
);
const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}><path d="m6 9 6 6 6-6"/></svg>
);
const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);

/* ============================================================
 * Corner Blobs — matches Figma exactly
 * ============================================================ */
function CornerBlobs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-500 sm:-top-14 sm:-right-14 sm:h-32 sm:w-32" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-primary-500 sm:-bottom-14 sm:-left-14 sm:h-32 sm:w-32" />
    </>
  );
}

/* ============================================================
 * Form Components
 * ============================================================ */
function InputField({ icon: Icon, placeholder, value, onChange, type = "text", error }) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          dir="rtl"
          className={`w-full rounded-xl border bg-white py-3 pr-10 pl-3 text-sm text-primary-900 outline-none transition placeholder:text-blue-light-950 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
            error ? "border-secondary-500" : "border-blue-light-700"
          }`}
        />
        <Icon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
      </div>
      {error && <p className="mt-1 mr-1 text-xs text-secondary-700" dir="rtl">{error}</p>}
    </div>
  );
}

function UploadField({ icon: Icon, label, hint, file, onChange, error }) {
  return (
    <div className="w-full">
      <label className="relative flex cursor-pointer items-center rounded-xl border border-dashed border-blue-light-700 bg-white px-3 py-3 text-sm text-primary-500 transition hover:bg-blue-light-50">
        <Icon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
        <span dir="rtl" className="truncate pr-8">{file ? file.name : label}</span>
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={onChange} />
      </label>
      {hint && <p className="mt-1 mr-1 text-xs text-blue-light-950" dir="rtl">{hint}</p>}
      {error && <p className="mt-1 mr-1 text-xs text-secondary-700" dir="rtl">{error}</p>}
    </div>
  );
}

/* ============================================================
 * Decorative Panel — matches Figma exactly
 * ============================================================ */
function DecorPanel() {
  return (
    <div className="relative hidden w-1/2 items-center justify-center bg-blue-light-50/60 md:flex">
      <div className="relative flex h-72 w-72 items-center justify-center lg:h-80 lg:w-80">
        {/* Main logo circle */}
        <img src={logo} alt="صلحلي" className="h-full w-full object-contain" />
        
        {/* Floating icons positioned around the logo */}
        <img src={lightningIcon} alt="" className="absolute -right-2 top-4 h-10 w-10" />
        <img src={wrenchIcon} alt="" className="absolute -left-4 bottom-8 h-10 w-10 -rotate-45" />
        <img src={screwdriverIcon} alt="" className="absolute right-4 -bottom-2 h-9 w-9 rotate-45" />
      </div>
    </div>
  );
}

/* ============================================================
 * Main Register Component
 * ============================================================ */
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [coords, setCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  const isTechnician = form.role === ROLES.TECHNICIAN;

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationDenied(false);
      },
      () => setLocationDenied(true)
    );
  }, []);

  useEffect(() => {
    fetchWithAuth(CATEGORIES_ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          setServices(json.data.map((c) => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const setFile = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }));
  const setRole = (role) => setForm((prev) => ({ ...prev, role }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "دخل اسمك";
    if (!form.city.trim()) next.city = "دخل مدينتك";
    if (!form.location.trim()) next.location = "دخل مكانك";
    if (!form.role) next.role = "اختار دورك";
    if (isTechnician) {
      if (!form.categoryId) next.categoryId = "اختار مجال الخدمة";
      if (!form.nationalId.trim() || form.nationalId.trim().length !== 14)
        next.nationalId = "الرقم القومي لازم يكون 14 رقم";
    }
    if (!coords) next.location = "محتاجين نعرف مكانك - فعّلي صلاحية الموقع في المتصفح";
    if (!form.agree) next.agree = "لازم توافق علي سياسة الخصوصية";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    try {
      const body = new FormData();
      body.append("fullName", form.fullName.trim());
      body.append("city", form.city.trim());
      body.append("address", form.location.trim());
      body.append("latitude", String(coords.lat));
      body.append("longitude", String(coords.lng));
      body.append("role", form.role);

      if (isTechnician) {
        body.append("categoryId", form.categoryId);
        body.append("nationalId", form.nationalId.trim());
        if (form.personalPhoto) body.append("profileImage", form.personalPhoto);
        if (form.criminalRecord) body.append("criminalRecordFile", form.criminalRecord);
      }

      const res = await fetchWithAuth(SIGNUP_ENDPOINT, { method: "POST", body });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 400 && json?.error?.details) {
          setErrors(mapApiErrors(json.error.details));
        } else if (res.status === 401) {
          setErrors({ submit: "انتهت صلاحية الجلسة، من فضلك سجلي دخول تاني" });
        } else if (res.status === 409) {
          setErrors({ submit: "الحساب ده خلص تسجيله بالفعل" });
        } else {
          setErrors({ submit: json?.error?.message || "حصل خطأ، حاول تاني" });
        }
        return;
      }

      if (form.role === ROLES.CUSTOMER) {
        navigate("/customer");
      } else {
        navigate("/pending-approval");
      }
    } catch {
      setErrors({ submit: "مقدرناش نوصل للسيرفر، تأكدي من الإنترنت وحاولي تاني" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen w-full items-center justify-center bg-blue-light-200 p-4 font-cairo sm:p-8"
    >
      <div className="relative w-full max-w-4xl">
        <CornerBlobs />

        <div className="relative z-10 flex w-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl md:flex-row">
          {/* ============ FORM SIDE ============ */}
          <div className="w-full p-6 sm:p-8 md:w-1/2 md:p-10">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                aria-label="الرئيسية"
                className="rounded-full p-1.5 text-primary-500 transition hover:bg-blue-light-100"
              >
                <HomeIcon className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-primary-500 sm:text-2xl">اعمل حساب جديد</h1>
              <img src={lightningIcon} alt="" className="h-7 w-7" />
            </div>

            {locationDenied && (
              <p className="mb-4 rounded-xl bg-secondary-50 px-3 py-2.5 text-xs text-secondary-700">
                محتاجين نعرف مكانك عشان نكمل التسجيل - من فضلك فعّلي صلاحية الموقع في المتصفح وارجعي حدّثي الصفحة.
              </p>
            )}

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <InputField icon={PersonIcon} placeholder="دخل اسمك" value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
              <InputField icon={PinIcon} placeholder="مدينتك" value={form.city} onChange={set("city")} error={errors.city} />
              <InputField icon={ArrowIcon} placeholder="مكانك" value={form.location} onChange={set("location")} error={errors.location} />

              {/* Role Selection */}
              <div>
                <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary-800">
                  <PersonIcon className="h-4 w-4 text-primary-500" />
                  دورك
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.CUSTOMER)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                      form.role === ROLES.CUSTOMER
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-primary-500 bg-white text-primary-700"
                    }`}
                  >
                    عميل
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.TECHNICIAN)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                      form.role === ROLES.TECHNICIAN
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-primary-500 bg-white text-primary-700"
                    }`}
                  >
                    فني
                  </button>
                </div>
                {errors.role && <p className="mt-1 text-xs text-secondary-700">{errors.role}</p>}
              </div>

              {/* Technician-only fields */}
              {isTechnician && (
                <>
                  <div className="relative">
                    <select
                      value={form.categoryId}
                      onChange={set("categoryId")}
                      dir="rtl"
                      className={`w-full appearance-none rounded-xl border bg-white py-3 pr-10 pl-8 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
                        errors.categoryId ? "border-secondary-500" : "border-blue-light-700"
                      }`}
                    >
                      <option value="">مجال الخدمة</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <WrenchIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                    <ChevronDownIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-light-950" />
                    {errors.categoryId && <p className="mt-1 text-xs text-secondary-700">{errors.categoryId}</p>}
                  </div>

                  <InputField icon={IdIcon} placeholder="دخل الرقم القومي" value={form.nationalId} onChange={set("nationalId")} error={errors.nationalId} />
                  <UploadField icon={UploadIcon} label="أرفع صورة شخصية" hint="اقصي حجم للصورة : 2 ميجا" file={form.personalPhoto} onChange={setFile("personalPhoto")} error={errors.personalPhoto} />
                  <UploadField icon={UploadIcon} label="فيش و تشبيه" file={form.criminalRecord} onChange={setFile("criminalRecord")} error={errors.criminalRecord} />
                </>
              )}

              {errors.submit && <p className="text-center text-xs text-secondary-700">{errors.submit}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-xl bg-primary-500 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-60"
              >
                {submitting ? "جاري الإرسال..." : "تمام"}
              </button>

              <label className="flex items-center justify-center gap-2 text-xs text-primary-600">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))}
                  className="h-4 w-4 rounded border-blue-light-700 text-primary-500 focus:ring-primary-300"
                />
                أنا أوافق علي سياسة الخصوصية
              </label>
              {errors.agree && <p className="-mt-2 text-center text-xs text-secondary-700">{errors.agree}</p>}
            </form>
          </div>

          {/* ============ DECORATIVE SIDE ============ */}
          <DecorPanel />
        </div>
      </div>
    </div>
  );
}