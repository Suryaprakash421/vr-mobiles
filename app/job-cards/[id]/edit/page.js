import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Layout from "../../../components/Layout";
import JobCardForm from "../../../components/JobCardForm";
import Link from "next/link";
import BackButton from "../../../components/BackButton";

export async function generateMetadata({ params }) {
  // Safely access params
  const { id: idParam } = params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    return {
      title: "Edit Job Card | Not Found",
    };
  }

  const jobCard = await prisma.jobCard.findUnique({
    where: { id },
    select: { customerName: true, billNo: true },
  });

  if (!jobCard) {
    return {
      title: "Edit Job Card | Not Found",
    };
  }

  return {
    title: `Edit: ${jobCard.customerName} - #${jobCard.billNo} | VR Mobiles`,
  };
}

export default async function EditJobCardPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Safely access params
  const { id: idParam } = params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    redirect("/job-cards");
  }

  const jobCard = await prisma.jobCard.findUnique({
    where: { id },
  });

  if (!jobCard) {
    redirect("/job-cards");
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <BackButton
            href={`/job-cards/${jobCard.id}`}
            label="Back to job card details"
          />
          <h1 className="text-2xl font-extrabold text-gray-900">
            Edit: {jobCard.customerName} - #{jobCard.billNo}
          </h1>
        </div>
        <JobCardForm jobCard={jobCard} isEditing={true} />
      </div>
    </Layout>
  );
}
