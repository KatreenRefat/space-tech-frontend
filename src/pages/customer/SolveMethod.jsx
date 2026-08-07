import { useLocation, useNavigate } from 'react-router-dom';

import BrandShell from '@/components/BrandShell.jsx';
import PrimaryButton from '@/components/PrimaryButton.jsx';
import { ROUTES } from '@/constants/routes.js';

/** العميل بيختار يوصف المشكلة للـ AI ولا يروح لفني على طول. */
export default function SolveMethod() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <BrandShell corners={['top-right']}>
      <div className="w-full max-w-[490px]">
        <h1 className="text-primary-500 text-3xl font-bold sm:text-4xl">ازاي تحل المشكلة</h1>

        <div className="mt-8 flex flex-col gap-2.5">
          <PrimaryButton
            type="button"
            className="py-3 text-sm font-medium"
            onClick={() => navigate(ROUTES.CUSTOMER.DIAGNOSIS, { state })}
          >
            اوصفهالنا بال AI
          </PrimaryButton>
          <PrimaryButton
            type="button"
            className="py-3 text-sm font-medium"
            onClick={() => navigate(ROUTES.CUSTOMER.TECHNICIANS, { state })}
          >
            استشاره خبير
          </PrimaryButton>
        </div>
      </div>
    </BrandShell>
  );
}
