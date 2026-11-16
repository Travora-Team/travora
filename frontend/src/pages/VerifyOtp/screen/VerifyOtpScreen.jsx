import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../../shared/components/PageContainer';
import { OtpVerificationCard } from '../../../shared/components/OtpVerificationCard';
import { useAuth } from '../../../shared/context/AuthContext';
import { extractOtpSessionParams } from '../models/verifyOtpModel';
import { NoActiveOtpSessionCard } from '../components/NoActiveOtpSessionCard';

export default function VerifyOtpScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  const { userId, purpose, channel, target, cooldownSeconds, devCode } = extractOtpSessionParams(
    location.state || {},
    searchParams
  );

  if (!userId) {
    return <NoActiveOtpSessionCard />;
  }

  return (
    <PageContainer className="flex min-h-[85vh] items-center justify-center pt-28 pb-16">
      <OtpVerificationCard
        userId={userId}
        purpose={purpose}
        initialChannel={channel}
        initialTarget={target}
        initialCooldown={cooldownSeconds}
        initialDevCode={devCode}
        onSuccess={(res) => {
          const verifiedUser = res?.user || res?.data?.user;
          if (verifiedUser) setUser(verifiedUser);
          navigate('/');
        }}
        onBack={() => navigate(-1)}
      />
    </PageContainer>
  );
}
