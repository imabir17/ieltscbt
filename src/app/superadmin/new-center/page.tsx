import { repo } from '@/lib/data/local';
import NewCenterForm from './NewCenterForm';
import { redirect } from 'next/navigation';

export default async function NewCenterPage() {
  const plans = await repo.getPlans();
  
  if (plans.length === 0) {
    // Cannot create a center without a plan
    redirect('/superadmin/plans');
  }

  // Convert SQLite row objects to plain JavaScript objects to avoid Next.js serialization error
  const plainPlans = plans.map(p => ({
    id: p.id,
    name: p.name,
    monthly_exam_quota: p.monthly_exam_quota,
    price: p.price,
    overage_fee_per_exam: p.overage_fee_per_exam,
    features: p.features
  }));

  return <NewCenterForm plans={plainPlans} />;
}
