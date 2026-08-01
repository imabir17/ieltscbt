import { repo } from '@/lib/data/local';
import NewCenterForm from './NewCenterForm';
import { redirect } from 'next/navigation';

export default async function NewCenterPage() {
  const plans = await repo.getPlans();
  
  if (plans.length === 0) {
    // Cannot create a center without a plan
    redirect('/superadmin/plans');
  }

  return <NewCenterForm plans={plans} />;
}
