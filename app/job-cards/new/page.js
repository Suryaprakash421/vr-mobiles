import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Layout from "../../components/Layout";
import JobCardForm from "../../components/JobCardForm";
import BackButton from "../../components/BackButton";

export default async function NewJobCardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <BackButton href="/job-cards" label="Back to job cards" />
          <h1 className="text-2xl font-extrabold text-gray-900">
            Create New Job Card
          </h1>
        </div>
        <JobCardForm />
      </div>
    </Layout>
  );
}
