import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Layout from "../../components/Layout";
import Link from "next/link";

export default async function JobCardDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const id = parseInt(params.id);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use a consistent date format that doesn't depend on locale
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Job Card #{jobCard.billNo}
          </h1>
          <div className="flex space-x-2">
            <Link
              href={`/job-cards/${jobCard.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/job-cards"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to List
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              Job Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700 text-sm font-medium">Bill Number</p>
                <p className="font-medium text-gray-900">{jobCard.billNo}</p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(jobCard.date)}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Created By</p>
                <p className="font-medium text-gray-900">
                  {jobCard.createdBy.name || jobCard.createdBy.username}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Status</p>
                <p
                  className={`font-medium ${
                    jobCard.finalAmount ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {jobCard.finalAmount ? "Completed" : "In Progress"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              Device Condition
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-700 text-sm font-medium">On</p>
                <p className="font-medium text-gray-900">
                  {jobCard.isOn ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Off</p>
                <p className="font-medium text-gray-900">
                  {jobCard.isOff ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Battery</p>
                <p className="font-medium text-gray-900">
                  {jobCard.hasBattery ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Door</p>
                <p className="font-medium text-gray-900">
                  {jobCard.hasDoor ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">SIM</p>
                <p className="font-medium text-gray-900">
                  {jobCard.hasSim ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Slot</p>
                <p className="font-medium text-gray-900">
                  {jobCard.hasSlot ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm font-medium">Name</p>
                <p className="font-medium text-gray-900">
                  {jobCard.customerName}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">
                  Mobile Number
                </p>
                <p className="font-medium text-gray-900">
                  {jobCard.mobileNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Address</p>
                <p className="font-medium text-gray-900">
                  {jobCard.address || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">
                  Aadhaar Number
                </p>
                <p className="font-medium text-gray-900">
                  {jobCard.aadhaarNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              Device Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm font-medium">Model</p>
                <p className="font-medium text-gray-900">{jobCard.model}</p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Complaint</p>
                <p className="font-medium text-gray-900">{jobCard.complaint}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              Financial Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-700 text-sm font-medium">
                  Admission Fees
                </p>
                <p className="font-medium text-gray-900">
                  {jobCard.admissionFees
                    ? `₹${jobCard.admissionFees.toFixed(2)}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Estimate</p>
                <p className="font-medium text-gray-900">
                  {jobCard.estimate ? `₹${jobCard.estimate.toFixed(2)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">Advance</p>
                <p className="font-medium text-gray-900">
                  {jobCard.advance ? `₹${jobCard.advance.toFixed(2)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">
                  Final Amount
                </p>
                <p className="font-medium text-gray-900">
                  {jobCard.finalAmount
                    ? `₹${jobCard.finalAmount.toFixed(2)}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
