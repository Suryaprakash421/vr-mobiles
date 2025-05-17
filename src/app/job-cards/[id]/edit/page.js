import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BackButton
                href={`/job-cards/${jobCard.id}`}
                label="Back to job card details"
                className="text-white hover:text-blue-100"
              />
              <h1 className="text-2xl font-extrabold">
                Edit: {jobCard.customerName} - #{jobCard.billNo}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6">
          <JobCardForm jobCard={jobCard} isEditing={true} />
        </div>
      </div>
    </Layout>
  );
}
