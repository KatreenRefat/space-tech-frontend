import logoImg from '@/assets/images/logo.svg';

/**
 * شاشة الانتظار بعد ما الفني يبعت بياناته — الدايرة اللي حوالين اللوجو
 * بتوضح إن الطلب لسه بيتراجع.
 */
export default function PendingScreen() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 text-center">
      <div
        className="aspect-square w-[70%] max-w-[430px] rounded-full p-[5%]"
        style={{
          background:
            'conic-gradient(var(--color-primary-500) 0deg 140deg, var(--color-blue-light-900) 140deg 360deg)',
        }}
      >
        <div className="bg-blue-light-200 flex h-full w-full items-center justify-center rounded-full p-[8%]">
          <img src={logoImg} alt="صلحلي" className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-2xl bg-white p-5" dir="rtl">
        <p className="border-blue-light-500 text-primary-500 rounded-lg border py-3 text-base font-semibold">
          معلش استنا و هنرد عليك بكرا
        </p>
      </div>
    </div>
  );
}
