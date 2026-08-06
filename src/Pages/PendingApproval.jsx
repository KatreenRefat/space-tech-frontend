import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";          // ← fixed path

const CHECK_STATUS_ENDPOINT = "/api/v1/me/status";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  const type = localStorage.getItem("tokenType") || "Bearer";
  return token ? { Authorization: `${type} ${token}` } : {};
}

export default function PendingApproval() {
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(CHECK_STATUS_ENDPOINT, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!res.ok) return;
        const json = await res.json();

        const isApproved =
          json?.data?.accountState === "APPROVED" ||
          json?.data?.isApproved === true ||
          json?.data?.status === "ACTIVE";

        if (isApproved) {
          navigate("/technician", { replace: true });
        }
      } catch {
        /* silently retry */
      }
    };

    checkStatus();
    const id = setInterval(checkStatus, 10000);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div
      dir="rtl"
      className="flex min-h-screen w-full items-center justify-center bg-blue-light-200 p-4 font-cairo sm:p-8"
    >
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary-500 sm:-top-14 sm:-right-14 sm:h-32 sm:w-32" />

        <div className="relative z-10 overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="flex w-full flex-col items-center justify-center gap-6 p-8 text-center sm:p-10">
            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 280 280">
                <circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${0.75 * 2 * Math.PI * 130} ${2 * Math.PI * 130}`}
                />
              </svg>
              <div className="flex h-[85%] w-[85%] items-center justify-center rounded-full bg-blue-light-200">
                <img src={logo} alt="صلحلي" className="h-[78%] w-[78%] object-contain" />
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl bg-blue-light-100 p-4">
              <p className="rounded-xl border border-dashed border-blue-light-700 bg-white py-3 text-sm font-semibold text-primary-700">
                معلش استنا و هنرد عليك بكرا
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-primary-800">
                ⏳ طلبك قيد المراجعة{dots}
              </h2>
              <p className="text-sm text-blue-light-950">
                فريق صَلْخِلي بيراجع بياناتك دلوقتي.
                <br />
                الصفحة هتتحدث لوحدها لما يتم التفعيل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}