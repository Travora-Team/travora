import { PageContainer } from '../../../shared/components/PageContainer';
import { NotFoundCard } from '../components/NotFoundCard';

export default function NotFoundScreen() {
  return (
    <PageContainer className="py-24 text-center">
      <NotFoundCard />
    </PageContainer>
  );
}
