export default function PendingApproval() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Cairo, sans-serif',
      textAlign: 'center',
      direction: 'rtl',
      background: '#e8f0fe'
    }}>
      <div style={{
        background: '#fff',
        padding: '60px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(27,42,74,0.1)'
      }}>
        <h1 style={{ color: '#1b2a4a', marginBottom: '16px' }}>⏳ طلبك قيد المراجعة</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>
          فريق صَلْخِلي بي reviewed بياناتك دلوقتي.<br />
          هنبعتلك إشعار لما يتم التفعيل.
        </p>
      </div>
    </div>
  );
}