const API_BASE = import.meta.env.VITE_API_URL || "";

async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, options);

  if (response.status === 204) {
    return null;
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errPayload = data?.error || {};
    const detailsText = errPayload.details
      ? Object.values(errPayload.details).join(" • ")
      : "";
    const message =
      detailsText ||
      errPayload.message ||
      data?.message ||
      "حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى.";

    const error = new Error(message);
    error.status = response.status;
    error.code = errPayload.code || "API_ERROR";
    error.details = errPayload.details || null;
    throw error;
  }

  return data;
}

export const authApi = {
  /**
   * إنشاء حساب جديد (مباشر أو مع إرسال رمز تحقق OTP)
   */
  register(payload) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * تأكيد رمز الـ OTP لتفعيل الحساب الجديد
   */
  verifyRegistrationOtp({ userId, channel, code }) {
    return apiRequest("/api/auth/register/verify-otp", {
      method: "POST",
      body: { userId, channel, code },
    });
  },

  /**
   * تسجيل الدخول المباشر عبر البريد وكلمة المرور
   */
  loginDirect({ email, password }) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  /**
   * بدء تسجيل الدخول الثنائي وإرسال رمز الـ OTP
   */
  initiateLoginOtp({ identifier, password, channel }) {
    return apiRequest("/api/auth/login/initiate", {
      method: "POST",
      body: { identifier, password, channel },
    });
  },

  /**
   * التحقق من رمز الدخول وإصدار جلسة المستخدم
   */
  verifyLoginOtp({ userId, channel, code }) {
    return apiRequest("/api/auth/login/verify-otp", {
      method: "POST",
      body: { userId, channel, code },
    });
  },

  /**
   * إعادة إرسال رمز التحقق ضمن فترات التهدئة المسموحة
   */
  resendOtp({ userId, channel, purpose }) {
    return apiRequest("/api/auth/otp/resend", {
      method: "POST",
      body: { userId, channel, purpose },
    });
  },

  /**
   * جلب بيانات المستخدم الحالي من الجلسة
   */
  getMe() {
    return apiRequest("/api/auth/me", { method: "GET" });
  },

  /**
   * تسجيل الخروج وإبطال الجلسة
   */
  logout() {
    return apiRequest("/api/auth/logout", {
      method: "POST",
      body: {},
    });
  },
};
