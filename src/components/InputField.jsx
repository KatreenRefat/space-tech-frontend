/** حقل إدخال بأيقونة على اليمين ورسالة خطأ تحته */
export default function InputField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}) {
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          className={`text-primary-900 placeholder:text-primary-300 focus:border-primary-500 focus:ring-primary-200 w-full rounded-lg border bg-white py-3 ps-3 pe-10 text-sm transition outline-none focus:ring-2 ${
            error ? 'border-secondary-500' : 'border-blue-light-700'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          dir="rtl"
        />
        <Icon className="text-primary-500 pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      </div>
      {error && (
        <p className="text-secondary-700 mt-1 text-xs" dir="rtl">
          {error}
        </p>
      )}
    </div>
  );
}
