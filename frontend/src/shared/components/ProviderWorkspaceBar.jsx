import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProviderWorkspaceBar({
  badgeLabel,
  title,
  subtitle,
  applicationStatus = 'approved',
  registrationReference = '',
  accentColor = '#0099FF',
}) {
  const { user } = useAuth();
  const isApproved = applicationStatus === 'approved' || user?.providerStatus === 'active';

  return (
    <div className="mb-4 rounded-3xl border border-[#DCEBFA] bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,153,255,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-[#BCE3FF] bg-[#EEF8FF] px-3 py-1 text-[11px] font-extrabold"
            style={{ color: accentColor }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0099FF] animate-ping" />
            <span>{badgeLabel}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold border ${
              isApproved
                ? 'bg-[#E8FFFB] border-[#99F6E4] text-[#00806B]'
                : 'bg-[#FFF5EB] border-[#FED7AA] text-[#CC6D00]'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isApproved ? 'bg-[#00C8A8]' : 'bg-[#FF8A00] animate-pulse'
              }`}
            />
            {isApproved ? 'منشأة معتمدة ونشطة بالمنصة' : 'الطلب قيد مراجعة الإدارة'}
          </span>

          {registrationReference && (
            <span className="rounded-full bg-[#F8FAFC] border border-[#DCEBFA] px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#475569]">
              ترخيص: {registrationReference}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="rounded-xl border border-[#DCEBFA] bg-[#EEF8FF] px-3 py-1.5 text-xs font-extrabold text-[#0077CC] hover:bg-[#DCEBFA] transition"
            >
              لوحة تحكم الأدمن ↗
            </Link>
          )}
          <Link
            to="/"
            className="rounded-xl border border-[#DCEBFA] bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#475569] hover:bg-[#EEF8FF] hover:text-[#0099FF] transition"
          >
            العودة للرئيسية ←
          </Link>
        </div>
      </div>

      <div className="mt-2.5">
        <h1 className="text-lg sm:text-xl font-black text-[#0D2447]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-[#64748B]">{subtitle}</p>}
      </div>
    </div>
  );
}
