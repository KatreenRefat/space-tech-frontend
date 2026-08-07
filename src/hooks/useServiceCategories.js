import { useEffect, useState } from 'react';
import { catalogService } from '@/services';

/**
 * Service categories a technician can sign up under.
 *
 * The endpoint is still being built (it answers 501), so a failure is expected
 * rather than exceptional: we fall back to the hardcoded list and let signup
 * proceed instead of blocking the form.
 */
const FALLBACK_CATEGORY_ID = '1';

const FALLBACK_CATEGORIES = [
  { id: FALLBACK_CATEGORY_ID, name: 'سباكة' },
  { id: FALLBACK_CATEGORY_ID, name: 'كهرباء' },
  { id: FALLBACK_CATEGORY_ID, name: 'نجارة' },
  { id: FALLBACK_CATEGORY_ID, name: 'دهانات' },
  { id: FALLBACK_CATEGORY_ID, name: 'تكييف وتبريد' },
];

export function useServiceCategories() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    let cancelled = false;

    catalogService
      .getCategories()
      .then((response) => {
        const list = response?.data;
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        setCategories(list.map((category) => ({ id: category.id, name: category.name })));
      })
      .catch(() => {
        // Endpoint not live yet — keep the fallback list.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}

export default useServiceCategories;
