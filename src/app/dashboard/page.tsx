import { redirect } from 'next/navigation';

export default function Dashboard() {
  // Redirect to restaurant business dashboard as default
  redirect('/dashboard/business/restaurant');
}
