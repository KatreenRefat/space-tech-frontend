/**
 * الدواير الكحلي الزخرفية اللي بتطل من زوايا الصفحة.
 *
 * كل شاشة في الديزاين بتستخدم توليفة مختلفة من الزوايا، فبنمرر الزوايا
 * المطلوبة بالاسم بدل ما نخمنها.
 *
 * المقاسات مربوطة بعرض الشاشة عشان الجزء الظاهر من الدايرة يفضل بنفس
 * نسبته زي الديزاين (فريم 1440×1024)، ومحكومة بـ vh كمان عشان ما تبلعش
 * الشاشة لو كانت عريضة وقصيرة.
 */

/* أسماء الكلاسات مكتوبة كاملة عشان Tailwind يقدر يشوفها وهو بيمسح الملفات. */
const CORNER_CLASSES = {
  'top-right': '-top-[min(36vw,49vh)] -right-[min(25vw,34vh)]',
  'top-left': '-top-[min(36vw,49vh)] -left-[min(25vw,34vh)]',
  'bottom-right': '-bottom-[min(30vw,41vh)] -right-[min(25vw,34vh)]',
  'bottom-left': '-bottom-[min(30vw,41vh)] -left-[min(25vw,34vh)]',
};

export default function CornerBlobs({ corners = ['top-right'] }) {
  return corners.map((corner) => (
    <div
      key={corner}
      className={`bg-primary-500 pointer-events-none absolute h-[min(50vw,68vh)] w-[min(50vw,68vh)] rounded-full ${CORNER_CLASSES[corner]}`}
    />
  ));
}
