import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';

const NO_FOOTER_PATHS = ['/login', '/register', '/partner-register', '/verify-otp', '/provider'];

export function PublicLayout() {
  const location = useLocation();
  const hideFooter = NO_FOOTER_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background-app text-content-primary">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
