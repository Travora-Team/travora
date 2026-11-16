import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';

export function AdminRouteGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] font-['Cairo'] text-sm font-bold text-[#0D2447]"
      >
        جارٍ التحقق من صلاحيات مدير المنصة...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?required=admin" replace />;
  }

  if (user.role !== 'admin') {
    if (user.role === 'provider') {
      return <Navigate to={`/provider/${user.providerType || 'hotel'}`} replace />;
    }
    return <Navigate to="/login?required=admin" replace />;
  }

  return children;
}

export function ProviderRouteGuard({ expectedType, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] font-['Cairo'] text-sm font-bold text-[#0D2447]"
      >
        جارٍ تحميل لوحة تحكم شريك الخدمة...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?required=${expectedType || 'provider'}`} replace />;
  }

  if (user.role === 'admin') {
    return children;
  }

  if (user.role !== 'provider') {
    return <Navigate to="/login?required=provider" replace />;
  }

  const userProviderType = user.providerType || 'hotel';
  if (expectedType && userProviderType !== expectedType) {
    return <Navigate to={`/provider/${userProviderType}`} replace />;
  }

  return children;
}
