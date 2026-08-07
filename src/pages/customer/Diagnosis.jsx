import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BrandShell from '@/components/BrandShell.jsx';
import PrimaryButton from '@/components/PrimaryButton.jsx';
import { CameraIcon } from '@/components/FieldIcons.jsx';
import { ROUTES } from '@/constants/routes.js';

/** العميل بيكتب مشكلته ويقدر يرفع صورة ليها. */
export default function Diagnosis() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    navigate(ROUTES.CUSTOMER.DIAGNOSIS_RESULT, { state: { description } });
  };

  return (
    <BrandShell corners={['top-right']}>
      <form className="w-full max-w-[490px]" onSubmit={handleSubmit}>
        <h1 className="text-primary-500 text-3xl font-bold sm:text-4xl">اوصف مشكلتك ل AI</h1>

        <input
          type="text"
          className="border-blue-light-700 text-primary-900 placeholder:text-primary-300 focus:border-primary-500 focus:ring-primary-200 mt-8 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
          placeholder="قول مشكلتك"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          dir="rtl"
        />

        <label className="border-primary-500 hover:bg-blue-light-50 mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-white px-4 py-10 transition">
          <CameraIcon className="text-primary-500 h-9 w-9" />
          <span className="text-primary-500 text-xs">{photo ? photo.name : 'حط صوره للمشكله'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </label>

        <PrimaryButton type="submit" className="mt-4">
          تمام
        </PrimaryButton>
      </form>
    </BrandShell>
  );
}
