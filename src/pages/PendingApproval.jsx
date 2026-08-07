import CornerBlobs from '@/components/CornerBlobs.jsx';
import PendingScreen from '@/components/PendingScreen.jsx';

/** الفني بعت بياناته وبيستنى موافقة الأدمن. */
export default function PendingApproval() {
  return (
    <div
      dir="rtl"
      className="bg-blue-light-200 font-cairo relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6"
    >
      <CornerBlobs corners={['top-left', 'bottom-right']} />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <PendingScreen />
      </div>
    </div>
  );
}
