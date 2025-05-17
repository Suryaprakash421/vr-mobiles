import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import Layout from "../../components/Layout";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import SimpleStatusDropdown from "../../components/SimpleStatusDropdown";
import JobCardNavigation from "../../components/JobCardNavigation";

export async function generateMetadata({ params }) {
  // Safely access params
  const { id: idParam } = params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    return {
      title: "Job Card Not Found",
    };
  }

  const jobCard = await prisma.jobCard.findUnique({
    where: { id },
    select: { customerName: true, billNo: true },
  });

  if (!jobCard) {
    return {
      title: "Job Card Not Found",
    };
  }

  return {
    title: `${jobCard.customerName} - #${jobCard.billNo} | VR Mobiles`,
  };
}

export default async function JobCardDetailPage({ params }) {
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
    include: {
      createdBy: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  if (!jobCard) {
    redirect("/job-cards");
  }

  // Get next and previous job card IDs for navigation
  const [prevJobCard, nextJobCard] = await Promise.all([
    // Get previous job card (created earlier)
    prisma.jobCard.findFirst({
      where: {
        createdAt: {
          lt: jobCard.createdAt, // Less than current job card's creation date
        },
      },
      orderBy: {
        createdAt: "desc", // Get the most recent one before current
      },
      select: {
        id: true,
        customerName: true,
        billNo: true,
      },
    }),
    // Get next job card (created later)
    prisma.jobCard.findFirst({
      where: {
        createdAt: {
          gt: jobCard.createdAt, // Greater than current job card's creation date
        },
      },
      orderBy: {
        createdAt: "asc", // Get the earliest one after current
      },
      select: {
        id: true,
        customerName: true,
        billNo: true,
      },
    }),
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use a consistent date format that doesn't depend on locale
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  return (
    <Layout>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BackButton
                href="/job-cards"
                label="Back to job cards"
                className="text-white hover:text-blue-100"
              />
              <h1 className="text-2xl font-extrabold">
                {jobCard.customerName} - #{jobCard.billNo}
              </h1>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/job-cards/${jobCard.id}/edit`}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
              <Link
                href="/job-cards"
                className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors duration-200 shadow-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Back to List
              </Link>
            </div>
          </div>

          {/* Status badge prominently displayed */}
          <div className="mt-4">
            <SimpleStatusDropdown
              jobId={jobCard.id}
              currentStatus={jobCard.status}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Job Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Job Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-700 text-sm font-medium">
                    Bill Number
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.billNo}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-700 text-sm font-medium">Date</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {formatDate(jobCard.date)}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    Created By
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.createdBy.name || jobCard.createdBy.username}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700 text-sm font-medium">
                    Created On
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {formatDate(jobCard.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Device Condition
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-3 rounded-md ${
                    jobCard.isOn ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.isOn ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Power On
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.isOn ? "Yes" : "No"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-md ${
                    jobCard.isOff ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.isOff ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Power Off
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.isOff ? "Yes" : "No"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-md ${
                    jobCard.hasBattery ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.hasBattery ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Battery
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.hasBattery ? "Yes" : "No"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-md ${
                    jobCard.hasDoor ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.hasDoor ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Door
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.hasDoor ? "Yes" : "No"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-md ${
                    jobCard.hasSim ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.hasSim ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    SIM
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.hasSim ? "Yes" : "No"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-md ${
                    jobCard.hasSlot ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      jobCard.hasSlot ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Slot
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.hasSlot ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Device Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-700 text-sm font-medium">Name</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.customerName}
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    Mobile Number
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.mobileNumber}
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-700 text-sm font-medium">Address</p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.address || "Not provided"}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-yellow-700 text-sm font-medium">
                    Aadhaar Number
                  </p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.aadhaarNumber || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Device Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-indigo-50 p-3 rounded-md">
                  <p className="text-indigo-700 text-sm font-medium">Model</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.model}
                  </p>
                </div>

                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-700 text-sm font-medium">Complaint</p>
                  <p className="font-semibold text-gray-900">
                    {jobCard.complaint}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mb-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Financial Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-700 text-sm font-medium">
                    Admission Fees
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.admissionFees
                      ? `₹${jobCard.admissionFees.toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-700 text-sm font-medium">
                    Estimate
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.estimate
                      ? `₹${jobCard.estimate.toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 text-sm font-medium">Advance</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.advance
                      ? `₹${jobCard.advance.toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-yellow-700 text-sm font-medium">
                    Final Amount
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {jobCard.finalAmount
                      ? `₹${jobCard.finalAmount.toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>

                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-700 text-sm font-medium">
                    Remaining Payment
                  </p>
                  <p
                    className={`font-semibold text-lg ${
                      jobCard.finalAmount &&
                      jobCard.advance &&
                      jobCard.finalAmount - jobCard.advance > 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {jobCard.finalAmount && jobCard.advance
                      ? `₹${(jobCard.finalAmount - jobCard.advance).toFixed(2)}`
                      : jobCard.finalAmount && !jobCard.advance
                      ? `₹${jobCard.finalAmount.toFixed(2)}`
                      : "Not applicable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation between job cards */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <JobCardNavigation
              prevJobCard={prevJobCard}
              nextJobCard={nextJobCard}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
