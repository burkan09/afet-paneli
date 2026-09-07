export default function RotateNotice() {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-8">
      <div className="text-center max-w-xs">
        <div className="text-5xl mb-5 text-slate-600">⟲</div>
        <h2 className="text-lg font-semibold text-slate-200 mb-2">
          Lütfen telefonu dik tutun
        </h2>
        <p className="text-sm text-slate-500">
          Bu panel dikey kullanım için tasarlandı. Cihazınızı döndürdüğünüzde
          otomatik olarak devam edecek.
        </p>
      </div>
    </div>
  );
}