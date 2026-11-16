import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthProvider } from '../shared/context/AuthContext';
import { AdminRouteGuard, ProviderRouteGuard } from './RoleRouteGuard';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import PartnerRegisterPage from '../pages/PartnerRegister';
import VerifyOtpPage from '../pages/VerifyOtp';
import AdminDashboardPage from '../pages/Admin';
import NotFoundPage from '../pages/NotFound';
import { HotelDashboardScreen } from '../providers/hotels';
import { RestaurantDashboardScreen } from '../providers/restaurants';
import { GuideDashboardScreen } from '../providers/guides';
import { TransportDashboardScreen } from '../providers/transport';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="partner-register" element={<PartnerRegisterPage />} />
            <Route path="verify-otp" element={<VerifyOtpPage />} />

            {/* Dedicated Service Provider Dashboards */}
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
      </AuthProvider>
    </BrowserRouter>
  );
}
