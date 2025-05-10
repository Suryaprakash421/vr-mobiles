import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Layout from '../../../components/Layout';
import JobCardForm from '../../../components/JobCardForm';

export default async function EditJobCardPage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    redirect('/job-cards');
  }
  
  const jobCard = await prisma.jobCard.findUnique({
    where: { id },
  });
  
  if (!jobCard) {
    redirect('/job-cards');
  }
  
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Job Card #{jobCard.billNo}</h1>
        <JobCardForm jobCard={jobCard} isEditing={true} />
      </div>
    </Layout>
  );
}
