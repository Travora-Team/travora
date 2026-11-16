import { TransportCompanyFields } from '../components/TransportCompanyFields';
import { CarOwnerFields } from '../components/CarOwnerFields';
import { CarRentalFields } from '../components/CarRentalFields';

export function TransportProviderScreen(props) {
  const { transportSubtype } = props;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
      {transportSubtype === 'transport_company' && <TransportCompanyFields {...props} />}
      {transportSubtype === 'car_owner' && <CarOwnerFields {...props} />}
      {transportSubtype === 'car_rental' && <CarRentalFields {...props} />}
    </div>
  );
}
