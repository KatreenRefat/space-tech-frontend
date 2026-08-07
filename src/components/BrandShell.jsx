import BrandTopBar from './BrandTopBar.jsx';
import CornerBlobs from './CornerBlobs.jsx';
import DecorPanel from './DecorPanel.jsx';

/**
 * الشكل العام للشاشات الداخلية: خلفية زرقا فاتحة، دواير كحلي في الزوايا،
 * شريط علوي فيه اللوجو، والمحتوى على اليمين واللوحة الزخرفية على الشمال.
 *
 * الاتجاه rtl، فأول عنصر في الـ flex row بيظهر على اليمين — عشان كده
 * المحتوى مكتوب قبل DecorPanel.
 */
export default function BrandShell({ corners = ['top-right'], children }) {
  return (
    <div
      dir="rtl"
      className="bg-blue-light-200 font-cairo relative flex min-h-screen w-full flex-col"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <CornerBlobs corners={corners} />
      </div>
      <BrandTopBar />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center md:flex-row">
        <div className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 md:justify-start md:ps-[5%] md:pe-0">
          {children}
        </div>
        <DecorPanel />
      </div>
    </div>
  );
}
