import logoImg from '@/assets/images/logo.svg';

/** الشريط العلوي اللي فيه اللوجو — بيتكرر في كل الشاشات الداخلية. */
export default function BrandTopBar() {
  return (
    <header className="border-blue-light-200 bg-blue-light-100 relative z-20 flex h-16 w-full shrink-0 items-center justify-end border-b px-6 sm:h-[88px] sm:px-10">
      <img src={logoImg} alt="صلحلي" className="h-10 w-auto sm:h-14" />
    </header>
  );
}
