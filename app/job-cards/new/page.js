import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import Layout from '../../components/Layout';
import JobCardForm from '../../components/JobCardForm';

export default async function NewJobCardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Job Card</h1>
        <JobCardForm />
      </div>
    </Layout>
  );
}
