import { useNavigate } from 'react-router-dom';

import BrandShell from '@/components/BrandShell.jsx';
import PrimaryButton from '@/components/PrimaryButton.jsx';
import { ROUTES } from '@/constants/routes.js';
import { useServiceCategories } from '@/hooks/useServiceCategories.js';

/** أول خطوة في طلب العميل — يختار مجال المشكلة. */
export default function Home() {
  const navigate = useNavigate();
  const categories = useServiceCategories();

  return (
    <BrandShell corners={['top-right']}>
      <div className="w-full max-w-[490px]">
        <h1 className="text-primary-500 text-3xl font-bold sm:text-4xl">اختار مجال المشكلة</h1>

        {/* الديزاين مرسوم بأربع تصنيفات، والـ API بيرجع أكتر — فالقايمة بتسكرول
            جواها بدل ما تكبر الشاشة كلها. */}
        <div className="mt-8 flex max-h-[46vh] flex-col gap-2.5 overflow-y-auto pe-1">
          {categories.map((category) => (
            <PrimaryButton
              key={category.name}
              type="button"
              className="py-3 text-sm font-medium"
              onClick={() =>
                navigate(ROUTES.CUSTOMER.SOLVE_METHOD, { state: { category: category.name } })
              }
            >
              {category.name}
            </PrimaryButton>
          ))}
        </div>
      </div>
    </BrandShell>
  );
}
