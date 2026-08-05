import { useState, useEffect } from "react";
import logoImg from "../../../assets/images/logo.svg";
import logoCircleImg from "../../../assets/images/logo-circle.svg";
import wrenchIcon from "../../../assets/icons/wrench.svg";
import screwdriverIcon from "../../../assets/icons/screwdriver.svg";
import lightningIcon from "../../../assets/icons/lightning.svg";
import personIcon from "../../../assets/icons/person.svg";
import pinIcon from "../../../assets/icons/pin.svg";
import arrowIcon from "../../../assets/icons/arrow.svg";
import idIcon from "../../../assets/icons/id.svg";
import uploadIcon from "../../../assets/icons/upload.svg";

/* ============================================================
 * ربط API - HomeService (POST /api/v1/me/signup)
 * ============================================================
 * - API_BASE فاضي عشان نستخدم Vite proxy بتاع /api أثناء التطوير.
 * - categoryId: بنحاول نجيب القايمة الحقيقية من GET /categories،
 *   ولو فشلت (لسه 501) بنستخدم قايمة احتياطية وcategoryId="1".
 * - latitude/longitude: من Geolocation المتصفح.
 * - تجديد التوكن تلقائيًا: أي نداء بيستخدم fetchWithAuth، ولو رجع
 *   401 (التوكن خلص)، بنجرب نجدده بالـ refreshToken تلقائيًا
 *   ونعيد المحاولة مرة واحدة من غير ما المستخدم يحس بحاجة.
 *   لو الـ refreshToken نفسه خلص، بترجع 401 عادي وبنطلب من
 *   المستخدم يسجل دخول تاني.
 * ============================================================ */
const API_BASE = "";
const SIGNUP_ENDPOINT = `${API_BASE}/api/v1/me/signup`;
const CATEGORIES_ENDPOINT = `${API_BASE}/api/v1/public/categories`;
const REFRESH_ENDPOINT = `${API_BASE}/api/v1/public/auth/refresh`;

const FALLBACK_CATEGORY_ID = "1";
const FALLBACK_SERVICES = [
  { id: FALLBACK_CATEGORY_ID, name: "سباكة" },
  { id: FALLBACK_CATEGORY_ID, name: "كهرباء" },
  { id: FALLBACK_CATEGORY_ID, name: "نجارة" },
  { id: FALLBACK_CATEGORY_ID, name: "دهانات" },
  { id: FALLBACK_CATEGORY_ID, name: "تكييف وتبريد" },
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

// بتحاول تجدد التوكن مرة واحدة بالـ refreshToken المخزن.
// بترجع true لو نجحت (والتوكن الجديد بقى في localStorage)، false لو فشلت.
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

// نفس fetch العادي، بس لو رجع 401 بيحاول يجدد التوكن ويعيد الطلب مرة واحدة
async function fetchWithAuth(url, options = {}) {
  const doFetch = () =>
    fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), ...getAuthHeader() },
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      res = await doFetch(); // إعادة المحاولة مرة واحدة بالتوكن الجديد
    }
  }

  return res;
}

// بيحول أخطاء details[] الراجعة من الـ API لشكل { fieldName: message }
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

const ROLES = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
};

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

/* ---------------------------------------------------------- */
/* أيقونات صغيرة (نفس روح التصميم) */
/* ---------------------------------------------------------- */
const PersonIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
  </svg>
);
const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
  </svg>
);
const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="m3 11 18-8-8 18-2-8-8-2Z" />
  </svg>
);
const WrenchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 6.5a4.5 4.5 0 0 1-6.4 4.1L8 18.2a2 2 0 1 1-2.8-2.8l7.6-7.6A4.5 4.5 0 1 1 22 6.5Z" />
  </svg>
);
const IdIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm4 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2Zm-3.5 8a3.5 3.5 0 0 1 7 0Zm9-6h7v1.5h-7Zm0 3h7V16h-7Z" />
  </svg>
);
const UploadIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 3 7 8h3v7h4V8h3ZM5 19h14v2H5Z" />
  </svg>
);
const BoltIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 3 14h6l-1 8 11-14h-7l1-6Z" />
  </svg>
);
const ScrewdriverIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.5 2 22 6.5l-2.1 2.1-1.4-1.4-1.5 1.5 1.4 1.4-2.1 2.1-1.4-1.4-8.3 8.3a2.1 2.1 0 0 1-3-3l8.3-8.3-1.4-1.4 2.1-2.1 1.4 1.4 1.5-1.5-1.4-1.4Z" />
  </svg>
);

/* ---------------------------------------------------------- */
/* دايرتين كحلي زخرفيتين في زاويتين متقابلتين من الصفحة */
/* ---------------------------------------------------------- */
function CornerBlobs({ corners = "top-right-bottom-left", showBoth = true }) {
  const isTopRight = corners === "top-right-bottom-left";
  return (
    <>
      <div
        className={`pointer-events-none absolute -top-32 h-56 w-56 rounded-full bg-primary-500 sm:-top-40 sm:h-72 sm:w-72 ${
          isTopRight ? "-right-32 sm:-right-40" : "-left-32 sm:-left-40"
        }`}
      />
      {showBoth && (
        <div
          className={`pointer-events-none absolute -bottom-32 h-56 w-56 rounded-full bg-primary-500 sm:-bottom-40 sm:h-72 sm:w-72 ${
            isTopRight ? "-left-32 sm:-left-40" : "-right-32 sm:-right-40"
          }`}
        />
      )}
    </>
  );
}

function InputField({ icon: Icon, placeholder, value, onChange, type = "text", error }) {
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          className={`w-full rounded-lg border bg-white py-2.5 pe-10 ps-3 text-sm text-primary-900 outline-none transition placeholder:text-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
            error ? "border-secondary-500" : "border-blue-light-700"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          dir="rtl"
        />
        <Icon className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-secondary-700" dir="rtl">
          {error}
        </p>
      )}
    </div>
  );
}

function UploadField({ icon: Icon, label, hint, file, onChange, error }) {
  return (
    <div>
      <label className="relative flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-blue-light-700 bg-white px-3 py-2.5 text-sm text-primary-500 transition hover:bg-blue-light-50">
        <span dir="rtl" className="truncate">
          {file ? file.name : label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-primary-500" />
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={onChange}
        />
      </label>
      {hint && (
        <p className="mt-1 text-xs text-primary-400" dir="rtl">
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 text-xs text-secondary-700" dir="rtl">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* اللوحة الزخرفية - نفس التصميم (الدايرة الكحلي ورا الدايرة البيضا + الأيقونات) */
/* ---------------------------------------------------------- */
function DecorPanel() {
  return (
    <div className="relative z-10 hidden md:flex md:w-1/2 items-center justify-center">
      <img
        src={logoCircleImg}
        alt="صلحلي"
        className="h-72 w-72 sm:h-80 sm:w-80"
      />

      <img
        src={lightningIcon}
        alt=""
        className="absolute left-[20%] top-[14%] h-8 w-8"
      />
      <img
        src={wrenchIcon}
        alt=""
        className="absolute bottom-[12%] left-[8%] h-9 w-9 -rotate-45"
      />
      <img
        src={screwdriverIcon}
        alt=""
        className="absolute bottom-[16%] right-[20%] h-8 w-8 rotate-45"
      />
    </div>
  );
}

function Logo({ size = "h-16 w-16" }) {
  return (
    <div className="flex flex-col items-center">
      <img src={logoImg} alt="صلحلي" className={`${size} object-contain`} />
    </div>
  );
}

/* ---------------------------------------------------------- */
/* شاشة الانتظار بعد الإرسال (الدايرة المتدرجة حوالين اللوجو) */
/* ---------------------------------------------------------- */
function PendingScreen() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 p-10 text-center">
      <div
        className="flex h-72 w-72 items-center justify-center rounded-full p-3"
        style={{
          background:
            "conic-gradient(var(--color-primary-500) 0deg 260deg, var(--color-blue-light-700) 260deg 360deg)",
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-light-200">
           <Logo size="h-70 w-70" />
        </div>


   
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-blue-light-50 p-4" dir="rtl">
        <p className="rounded-lg border border-dashed border-primary-300 bg-white py-2.5 text-sm font-medium text-primary-700">
          معلش استنا و هنرد عليك بكرا
        </p>
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [coords, setCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  const isTechnician = form.role === ROLES.TECHNICIAN;

  // هات إحداثيات المستخدم أول ما الصفحة تفتح
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

  // حاول تجيب فئات الخدمة الحقيقية (لو GET /categories اشتغل) - بالتجديد التلقائي
  useEffect(() => {
    fetchWithAuth(CATEGORIES_ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length > 0) {
          setServices(json.data.map((c) => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => {
        // لسه 501 - نفضل مستخدمين القايمة الاحتياطية
      });
  }, []);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setFile = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }));

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
      body.append("role", form.role); // CUSTOMER | TECHNICIAN

      if (isTechnician) {
        body.append("categoryId", form.categoryId);
        body.append("nationalId", form.nationalId.trim());
        if (form.personalPhoto) body.append("profileImage", form.personalPhoto);
        if (form.criminalRecord) body.append("criminalRecordFile", form.criminalRecord);
      }

      // fetchWithAuth بتحاول تجدد التوكن تلقائيًا لو لقته منتهي، وتعيد
      // المحاولة مرة واحدة - المستخدم مش هيحس بحاجة طالما الـ refreshToken لسه صالح
      const res = await fetchWithAuth(SIGNUP_ENDPOINT, {
        method: "POST",
        body,
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 400 && json?.error?.details) {
          setErrors(mapApiErrors(json.error.details));
        } else if (res.status === 401) {
          // وصلنا هنا يبقى حتى الـ refreshToken خلص - لازم تسجيل دخول جديد بالكامل
          setErrors({ submit: "انتهت صلاحية الجلسة، من فضلك سجلي دخول تاني" });
        } else if (res.status === 409) {
          setErrors({ submit: "الحساب ده خلص تسجيله بالفعل" });
        } else {
          setErrors({ submit: json?.error?.message || "حصل خطأ، حاول تاني" });
        }
        return;
      }

      // نجاح - json.data.accountState: READY (عميل) أو WAITING_FOR_APPROVAL (فني)
      if (isTechnician) {
        setSubmitted(true); // يوديه لشاشة "معلش استنا وهنرد عليك بكرا"
      } else {
        // TODO: العميل يروح فين بعد التسجيل؟ (مثلاً navigate("/home"))
        // حاليًا مفيش تحويل، حط هنا اللي يناسبك.
        setSubmitted(true);
      }
    } catch (err) {
      setErrors({ submit: "مقدرناش نوصل للسيرفر، تأكدي من الإنترنت وحاولي تاني" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full overflow-hidden bg-blue-light-200 font-cairo"
    >
      {submitted ? (
        <>
          <CornerBlobs corners="top-left-bottom-right" />
          <div className="relative z-10 flex w-full items-center justify-center">
            <PendingScreen />
          </div>
        </>
      ) : (
        <>
      <CornerBlobs corners="top-right-bottom-left" showBoth={isTechnician} />

          {/* ============ الفورم - شمال ============ */}
          <div className="relative z-10 flex w-full items-center justify-center p-6 sm:p-10 md:w-1/2">
            <div className="w-full max-w-sm">
              <div className="mb-5 flex items-center justify-between" dir="rtl">
                <h1 className="text-2xl font-semibold text-primary-500">
                  اعمل حساب جديد
                </h1>
                <img src={lightningIcon} alt="" className="h-8 w-8" />
              </div>

              {locationDenied && (
                <p
                  className="mb-3 rounded-lg bg-secondary-50 px-3 py-2 text-xs text-secondary-700"
                  dir="rtl"
                >
                  محتاجين نعرف مكانك عشان نكمل التسجيل - من فضلك فعّلي صلاحية
                  الموقع في المتصفح وارجعي حدّثي الصفحة.
                </p>
              )}

              <form className="flex flex-col gap-3" dir="rtl" onSubmit={handleSubmit}>
                <InputField
                  icon={PersonIcon}
                  placeholder="دخل اسمك"
                  value={form.fullName}
                  onChange={set("fullName")}
                  error={errors.fullName}
                />

                <InputField
                  icon={PinIcon}
                  placeholder="مدينتك"
                  value={form.city}
                  onChange={set("city")}
                  error={errors.city}
                />

                <InputField
                  icon={ArrowIcon}
                  placeholder="مكانك"
                  value={form.location}
                  onChange={set("location")}
                  error={errors.location}
                />

                {/* دورك */}
                <div>
                  <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-primary-800">
                    <PersonIcon className="h-4 w-4 text-primary-500" />
                    دورك
                  </span>
                  <div className="flex flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setRole(ROLES.CUSTOMER)}
                      className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                        form.role === ROLES.CUSTOMER
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-blue-light-700 bg-white text-primary-700"
                      }`}
                    >
                      عميل
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole(ROLES.TECHNICIAN)}
                      className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                        form.role === ROLES.TECHNICIAN
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-blue-light-700 bg-white text-primary-700"
                      }`}
                    >
                      فني
                    </button>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-xs text-secondary-700">{errors.role}</p>
                  )}
                </div>

                {/* حقول إضافية تظهر بس لو دوس على "فني" */}
                {isTechnician && (
                  <>
                    {/* مجال الخدمة - select (categoryId) */}
                    <div>
                      <div className="relative">
                        <select
                          className={`w-full appearance-none rounded-lg border bg-white py-2.5 pe-10 ps-8 text-sm text-primary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${
                            errors.categoryId ? "border-secondary-500" : "border-blue-light-700"
                          }`}
                          value={form.categoryId}
                          onChange={set("categoryId")}
                          dir="rtl"
                        >
                          <option value="">مجال الخدمة</option>
                          {services.map((s) => (
                            <option key={s.name} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <WrenchIcon className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
                        <svg
                          className="pointer-events-none absolute start-3 top-1/2 h-3 w-3 -translate-y-1/2 text-primary-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                      {errors.categoryId && (
                        <p className="mt-1 text-xs text-secondary-700">{errors.categoryId}</p>
                      )}
                    </div>

                    <InputField
                      icon={IdIcon}
                      placeholder="دخل الرقم القومي"
                      value={form.nationalId}
                      onChange={set("nationalId")}
                      error={errors.nationalId}
                    />

                    <UploadField
                      icon={UploadIcon}
                      label="أرفع صورة شخصية"
                      hint="اقصي حجم للصورة : 2 ميجا"
                      file={form.personalPhoto}
                      onChange={setFile("personalPhoto")}
                      error={errors.personalPhoto}
                    />

                    <UploadField
                      icon={UploadIcon}
                      label="فيش و تشبيه"
                      file={form.criminalRecord}
                      onChange={setFile("criminalRecord")}
                      error={errors.criminalRecord}
                    />
                  </>
                )}

                {errors.submit && (
                  <p className="text-center text-xs text-secondary-700">
                    {errors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 rounded-lg bg-primary-500 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
                >
                  {submitting ? "جاري الإرسال..." : "تمام"}
                </button>

                <label className="flex items-center justify-center gap-2 text-xs text-primary-600">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, agree: e.target.checked }))
                    }
                    className="h-3.5 w-3.5 rounded border-blue-light-700 text-primary-500 focus:ring-primary-300"
                  />
                  أنا أوافق علي سياسة الخصوصية
                </label>
                {errors.agree && (
                  <p className="-mt-2 text-center text-xs text-secondary-700">
                    {errors.agree}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* ============ اللوحة الزخرفية - يمين ============ */}
          <DecorPanel />
        </>
      )}
    </div>
  );
}

