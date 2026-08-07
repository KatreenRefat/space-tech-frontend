/** الزرار الكحلي العريض اللي بيتكرر في كل الشاشات. */
export default function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-primary-500 hover:bg-primary-600 w-full rounded-lg py-3.5 text-base font-bold text-white transition disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
