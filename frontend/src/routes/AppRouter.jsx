import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthProvider } from '../shared/context/AuthContext';
import { AdminRouteGuard, ProviderRouteGuard } from './RoleRouteGuard';
import HomePage from '../pages/Home';
import AuthScreen from '../pages/Login/screen/LoginScreen';
import NotFoundPage from '../pages/NotFound';

// التحميل الكسول (Code Splitting) للوحات التحكم الثقيلة لمنع استهلاك الذاكرة والبيانات عند فتح صفحات المصادقة أو الرئيسية
const PartnerRegisterPage = lazy(() => import('../pages/PartnerRegister'));
const AdminDashboardPage = lazy(() => import('../pages/Admin'));
const HotelDashboardScreen = lazy(() =>
  import('../providers/hotels').then((m) => ({ default: m.HotelDashboardScreen }))
);
const RestaurantDashboardScreen = lazy(() =>
  import('../providers/restaurants').then((m) => ({ default: m.RestaurantDashboardScreen }))
);
const GuideDashboardScreen = lazy(() =>
  import('../providers/guides').then((m) => ({ default: m.GuideDashboardScreen }))
);
const TransportDashboardScreen = lazy(() =>
  import('../providers/transport').then((m) => ({ default: m.TransportDashboardScreen }))
);

function RouteLoadingFallback() {
  return (
    <div
      dir="rtl"
      className="flex min-h-[60vh] items-center justify-center font-['Cairo'] text-sm font-bold text-[#0D2447]"
    >
      جارٍ تحميل الواجهة...
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <AdminRouteGuard>
                  <AdminDashboardPage />
                </AdminRouteGuard>
              }
            />
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />

              {/* مسارات المصادقة الثلاثة تشترك في نفس المكون (AuthScreen) ليُحمّل مرة واحدة فقط في الذاكرة */}
              <Route path="login" element={<AuthScreen />} />
              <Route path="register" element={<AuthScreen />} />
              <Route path="verify-otp" element={<AuthScreen />} />

              <Route path="partner-register" element={<PartnerRegisterPage />} />

              {/* لوحات تحكم الشركاء المحمّلة عند الطلب فقط */}
              <Route
                path="provider/hotel"
                element={
                  <ProviderRouteGuard expectedType="hotel">
                    <HotelDashboardScreen />
                  </ProviderRouteGuard>
                }
              />
              <Route
                path="provider/restaurant"
                element={
                  <ProviderRouteGuard expectedType="restaurant">
                    <RestaurantDashboardScreen />
                  </ProviderRouteGuard>
                }
              />
              <Route
                path="provider/guide"
                element={
                  <ProviderRouteGuard expectedType="guide">
                    <GuideDashboardScreen />
                  </ProviderRouteGuard>
                }
              />
              <Route
                path="provider/transport"
                element={
                  <ProviderRouteGuard expectedType="transport">
                    <TransportDashboardScreen />
                  </ProviderRouteGuard>
                }
              />
              <Route path="provider" element={<Navigate to="/provider/hotel" replace />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}