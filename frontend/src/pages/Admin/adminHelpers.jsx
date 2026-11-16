/* eslint-disable react-refresh/only-export-components */
export function formatMoney(minorUnits, currency = 'EGP') {
  const num = Number(minorUnits || 0) / 100;
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const symbolMap = {
    EGP: 'ج.م',
    USD: '$',
    EUR: '€',
    SAR: 'ر.س',
  };
  return `${formatted} ${symbolMap[currency] || currency}`;
}

export function formatDateAr(dateStr, includeTime = false) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
  } catch {
    return String(dateStr);
  }
}

export const BOOKING_KIND_META = {
  HOTEL: {
    label: 'فنادق وإقامة فاخرة',
    shortLabel: 'الفنادق',
    color: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]',
    barColor: 'from-[#0099FF] to-[#38BDF8]',
    iconBg: 'bg-[#E5F3FF] text-[#159CF6]',
  },
  ACTIVITY: {
    label: 'أنشطة وتجارب بحرية وثقافية',
    shortLabel: 'الأنشطة',
    color: 'bg-[#E8FFFB] text-[#00806B] border-[#99F6E4]',
    barColor: 'from-[#00C8A8] to-[#14B8A6]',
    iconBg: 'bg-[#E5F8F5] text-[#12B9A7]',
  },
  TRANSPORT: {
    label: 'نقل فاخر وليموزين VIP',
    shortLabel: 'النقل VIP',
    color: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    barColor: 'from-[#2563EB] to-[#60A5FA]',
    iconBg: 'bg-[#E3F2FF] text-[#1D4ED8]',
  },
  RESTAURANT: {
    label: 'مطاعم راقية وضيافة',
    shortLabel: 'المطاعم',
    color: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]',
    barColor: 'from-[#FF8A00] to-[#FBBF24]',
    iconBg: 'bg-[#FFF5EB] text-[#FF8A00]',
  },
  GUIDE: {
    label: 'مرشدون سياحيون معتمدون',
    shortLabel: 'المرشدون',
    color: 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]',
    barColor: 'from-[#0D9488] to-[#2DD4BF]',
    iconBg: 'bg-[#E6FAF7] text-[#13BDB7]',
  },
  DELIVERY: {
    label: 'توصيل طلبات وخدمات سريعة',
    shortLabel: 'التوصيل',
    color: 'bg-[#FFF5EB] text-[#E67B00] border-[#FED7AA]',
    barColor: 'from-[#F59E0B] to-[#FBBF24]',
    iconBg: 'bg-[#FEF3C7] text-[#D97706]',
  },
};

export const CATEGORY_CODE_AR = {
  hotel: 'الفنادق والإقامة',
  activity: 'الأنشطة والتجارب',
  transport: 'النقل والليموزين VIP',
  restaurant: 'المطاعم الفاخرة',
  guide: 'الإرشاد السياحي',
  delivery: 'التوصيل السريع',
};

export function SparkleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2C20.9 12.8 25.6 18 36 20C25.6 22 20.9 27.2 20 38C19.1 27.2 14.4 22 4 20C14.4 18 19.1 12.8 20 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CornerWaves({ className = '', flipX = false, flipY = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 330 230"
      fill="none"
      preserveAspectRatio="none"
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <path
          key={item}
          d={`M ${-85 - item * 23} 220 C 65 220, 135 170, 155 110 C 175 50, 160 -5, 115 -42`}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={0.7 - item * 0.09}
        />
      ))}
    </svg>
  );
}

export function AdminIcon({ name, className = 'w-5 h-5' }) {
  switch (name) {
    case 'overview':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="2" />
          <rect x="14" y="3" width="7" height="5" rx="2" />
          <rect x="14" y="12" width="7" height="9" rx="2" />
          <rect x="3" y="16" width="7" height="5" rx="2" />
        </svg>
      );
    case 'reports':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14l4-4 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'catalog':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5Z" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'providers':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" strokeLinecap="round" />
        </svg>
      );
    case 'applications':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3l8 4v5c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V7l8-4Z" strokeLinejoin="round" />
        </svg>
      );
    case 'users':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
          <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" strokeLinecap="round" />
        </svg>
      );
    case 'bookings':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" />
        </svg>
      );
    case 'disputes':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10Z" strokeLinejoin="round" />
          <path d="M12 7v4M12 14h.01" strokeLinecap="round" />
        </svg>
      );
    case 'commissions':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="5" x2="5" y2="19" strokeLinecap="round" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case 'settlements':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M2 10h20M6 15h4" strokeLinecap="round" />
        </svg>
      );
    case 'payouts':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'audit':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6Z" strokeLinejoin="round" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1Z" />
        </svg>
      );
    case 'globe':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10Z" />
        </svg>
      );
    case 'search':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  const map = {
    active: { text: 'نشط ومفعل', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    approved: { text: 'معتمد رسمياً', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    confirmed: { text: 'حجز مؤكد', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    completed: { text: 'مكتمل بنجاح', cls: 'bg-[#E8FFFB] text-[#00806B] border-[#99F6E4]' },
    succeeded: { text: 'تم التحويل', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    resolved: { text: 'تم الحل', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    published: { text: 'منشور', cls: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' },
    pending: { text: 'قيد المراجعة', cls: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]' },
    submitted: { text: 'طلب جديد', cls: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]' },
    in_review: { text: 'استكمال مستندات', cls: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]' },
    pending_payment: { text: 'بانتظار الدفع', cls: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]' },
    processing: { text: 'جاري التنفيذ', cls: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]' },
    draft: { text: 'مسودة', cls: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]' },
    open: { text: 'تذكرة مفتوحة', cls: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]' },
    waiting_agent: { text: 'بانتظار الإدارة', cls: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]' },
    waiting_customer: { text: 'بانتظار العميل', cls: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]' },
    closed: { text: 'مغلقة', cls: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]' },
    suspended: { text: 'موقوف مؤقتاً', cls: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]' },
    rejected: { text: 'مرفوض', cls: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]' },
    cancelled: { text: 'ملغي', cls: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]' },
    failed: { text: 'فشل العملية', cls: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]' },
    archived: { text: 'مؤرشف', cls: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]' },
    void: { text: 'ملغاة', cls: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]' },
  };
  const item = map[s] || { text: status, cls: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-extrabold shadow-2xs ${item.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {item.text}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const p = String(priority || '').toUpperCase();
  const map = {
    URGENT: { text: 'عاجل جداً', cls: 'bg-gradient-to-l from-[#EF4444] to-[#DC2626] text-white shadow-xs' },
    HIGH: { text: 'أولوية مرتفعة', cls: 'bg-gradient-to-l from-[#FF8A00] to-[#F59E0B] text-white shadow-xs' },
    NORMAL: { text: 'أولوية عادية', cls: 'bg-[#EEF8FF] text-[#0077CC] border border-[#BCE3FF]' },
    LOW: { text: 'منخفضة', cls: 'bg-[#F1F5F9] text-[#64748B]' },
  };
  const item = map[p] || map.NORMAL;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${item.cls}`}>
      {item.text}
    </span>
  );
}

export function InitialsAvatar({ name, tone = 'blue' }) {
  const clean = String(name || 'T').trim();
  const parts = clean.split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : clean.slice(0, 2);
  const tones = {
    blue: 'from-[#0099FF] to-[#00C8A8] text-white shadow-[0_6px_16px_rgba(0,153,255,0.22)]',
    teal: 'from-[#00C8A8] to-[#0D9488] text-white shadow-[0_6px_16px_rgba(0,200,168,0.22)]',
    orange: 'from-[#FF8A00] to-[#F59E0B] text-white shadow-[0_6px_16px_rgba(255,138,0,0.22)]',
    navy: 'from-[#0D2447] to-[#1E3A8A] text-white shadow-[0_6px_16px_rgba(13,36,71,0.22)]',
  };
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-black text-sm ${
        tones[tone] || tones.blue
      }`}
    >
      {initials}
    </div>
  );
}

export function LuxuryKpiCard({
  title,
  value,
  subtitle,
  badgeText,
  iconName,
  tone = 'blue',
  progress = 78,
  onClick,
}) {
  const toneStyles = {
    blue: {
      iconBg: 'bg-[#E5F3FF] text-[#159CF6]',
      badge: 'bg-[#EEF8FF] text-[#0077CC] border-[#BCE3FF]',
      bar: 'from-[#0099FF] to-[#2DAFFA]',
      glow: 'hover:border-[#93C5FD] hover:shadow-[0_18px_40px_rgba(21,156,246,0.12)]',
    },
    teal: {
      iconBg: 'bg-[#E5F8F5] text-[#12B9A7]',
      badge: 'bg-[#E8FFFB] text-[#00806B] border-[#99F6E4]',
      bar: 'from-[#00C8A8] to-[#14B8A6]',
      glow: 'hover:border-[#5EEAD4] hover:shadow-[0_18px_40px_rgba(18,185,167,0.12)]',
    },
    orange: {
      iconBg: 'bg-[#FFF5EB] text-[#FF8A00]',
      badge: 'bg-[#FFF5EB] text-[#CC6D00] border-[#FED7AA]',
      bar: 'from-[#FF8A00] to-[#FBBF24]',
      glow: 'hover:border-[#FDBA74] hover:shadow-[0_18px_40px_rgba(255,138,0,0.12)]',
    },
    rose: {
      iconBg: 'bg-[#FEE2E2] text-[#EF4444]',
      badge: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]',
      bar: 'from-[#EF4444] to-[#F87171]',
      glow: 'hover:border-[#FCA5A5] hover:shadow-[0_18px_40px_rgba(239,68,68,0.12)]',
    },
  };
  const st = toneStyles[tone] || toneStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[22px] border border-[#DCEBFA] bg-white p-5 text-right shadow-[0_10px_30px_rgba(45,87,126,0.06)] transition-all duration-300 hover:-translate-y-1 ${st.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle decorative corner glow */}
      <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#0099FF]/5 to-[#00C8A8]/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${st.iconBg}`}>
          <AdminIcon name={iconName} className="h-6 w-6" />
        </div>

        {badgeText && (
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${st.badge}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-[#7187A5]">{title}</p>
        <p className="mt-1 text-2xl sm:text-[28px] font-black tracking-tight text-[#0D2447]">
          {value}
        </p>
      </div>

      {/* Mini visual bar */}
      <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className={`h-full rounded-full bg-gradient-to-l ${st.bar} transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(12, progress))}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] font-extrabold text-[#159CF6]">
        <span className="text-[#64748B] font-semibold">{subtitle}</span>
        {onClick && (
          <span className="inline-flex items-center gap-1 transition-all group-hover:gap-2">
            <span>استعراض</span>
            <span>←</span>
          </span>
        )}
      </div>
    </div>
  );
}
