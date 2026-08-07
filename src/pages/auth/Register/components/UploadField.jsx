/** زرار رفع ملف بشكل حقل — بيعرض اسم الملف بعد الاختيار */
export default function UploadField({ icon: Icon, label, hint, file, onChange, error }) {
  return (
    <div>
      <label className="border-blue-light-700 text-primary-500 hover:bg-blue-light-50 relative flex cursor-pointer items-center justify-between rounded-lg border border-dashed bg-white px-3 py-2.5 text-sm transition">
        <span dir="rtl" className="truncate">
          {file ? file.name : label}
        </span>
        <Icon className="text-primary-500 h-4 w-4 shrink-0" />
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={onChange}
        />
      </label>
      {hint && (
        <p className="text-primary-400 mt-1 text-xs" dir="rtl">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-secondary-700 mt-1 text-xs" dir="rtl">
          {error}
        </p>
      )}
    </div>
  );
}
