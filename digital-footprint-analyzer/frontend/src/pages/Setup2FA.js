import { useLocation, Link } from "react-router-dom";

export default function Setup2FA() {
  const { state } = useLocation();
  if (!state?.qrImage) return <div>Missing QR data</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1f] text-white">
      <h2 className="text-3xl font-bold mb-6">Scan this QR in Google Authenticator</h2>
      <img src={state.qrImage} alt="QR" className="p-4 bg-white rounded-lg shadow-lg" />
      <Link to="/login" className="mt-6 px-6 py-3 bg-blue-600 rounded-lg">Continue</Link>
    </div>
  );
}
