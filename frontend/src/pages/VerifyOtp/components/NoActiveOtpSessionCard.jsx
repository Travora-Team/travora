import { Link } from 'react-router-dom';
import { PageContainer } from '../../../shared/components/PageContainer';

export function NoActiveOtpSessionCard() {
  return (
    <PageContainer className="flex min-h-[80vh] items-center justify-center pt-28 pb-16">
      <div className="w-full max-w-md rounded-[28px] border border-divider bg-white p-8 text-center soft-shadow">
        <h1 className="text-xl font-black text-content-primary">لا توجد جلسة تحقق نشطة</h1>
        <p className="mt-2 text-sm text-content-secondary">
          يرجى البدء بتسجيل الدخول أو إنشاء حساب جديد للحصول على رمز التحقق.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-divider px-5 py-2.5 text-sm font-bold text-content-primary"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
