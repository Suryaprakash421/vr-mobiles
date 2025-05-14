import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Layout from "../../components/Layout";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import CustomerDetailRefresher from "../../components/CustomerDetailRefresher";
import JobCardHistoryTable from "../../components/JobCardHistoryTable";

export async function generateMetadata({ params }) {
  // Safely access params
  const { id: idParam } = params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    return {
      title: "Customer Not Found",
    };
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { name: true },
  });

  if (!customer) {
    return {
      title: "Customer Not Found",
    };
  }

  return {
    title: `${customer.name} | Customer Details | VR Mobiles`,
  };
}

export default async function CustomerDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Safely access params
  const { id: idParam } = params;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    redirect("/customers");
  }

  // Try to get the customer with job cards
  let customer;
  try {
    // First, get the customer details
    customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (customer) {
      // Then, get all job cards with this customer's mobile number
      const jobCards = await prisma.jobCard.findMany({
        where: {
          OR: [{ customerId: id }, { mobileNumber: customer.mobileNumber }],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });

      // Add job cards to customer object
      customer.jobCards = jobCards;

      console.log(
        `Found ${jobCards.length} job cards for customer ${id} with mobile ${customer.mobileNumber}`
      );
    }
  } catch (error) {
    console.error("Error fetching customer with job cards:", error);

    // Fallback to fetching customer without job cards
    if (!customer) {
      customer = await prisma.customer.findUnique({
        where: { id },
      });
    }

    // Add empty job cards array if needed
    if (customer && !customer.jobCards) {
      customer.jobCards = [];
    }
  }

  if (!customer) {
    redirect("/customers");
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  return (
    <Layout>
      {/* Add the refresher component */}
      <CustomerDetailRefresher />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BackButton
                href="/customers"
                label="Back to customers"
                className="text-white hover:text-blue-100"
              />
              <h1 className="text-2xl font-extrabold">{customer.name}</h1>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/customers/${customer.id}/edit`}
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
                href="/customers"
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

          {/* Visit count badge */}
          <div className="mt-4 bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full">
            <span className="text-white font-semibold">
              Total Visits: {customer.visitCount || customer.jobCards.length}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Details Section */}
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
                  <div className="flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 mr-2"
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
                    <p className="font-semibold text-gray-900 text-lg">
                      {customer.name}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    Mobile Number
                  </p>
                  <div className="flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="font-semibold text-gray-900 text-lg">
                      {customer.mobileNumber}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-700 text-sm font-medium">Address</p>
                  <div className="flex items-start mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="font-semibold text-gray-900">
                      {customer.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-yellow-700 text-sm font-medium">
                    Aadhaar Number
                  </p>
                  <div className="flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    <p className="font-semibold text-gray-900">
                      {customer.aadhaarNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                Visit Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-blue-700 text-sm font-medium">
                    Total Visits
                  </p>
                  <p className="font-semibold text-gray-900 text-2xl">
                    {customer.visitCount || customer.jobCards.length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    First Visit
                  </p>
                  <p className="font-semibold text-gray-900">
                    {customer.jobCards.length > 0
                      ? formatDate(
                          customer.jobCards[customer.jobCards.length - 1]
                            .createdAt
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-purple-700 text-sm font-medium">
                    Last Visit
                  </p>
                  <p className="font-semibold text-gray-900">
                    {customer.jobCards.length > 0
                      ? formatDate(customer.jobCards[0].createdAt)
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-yellow-700 text-sm font-medium">
                    Customer Since
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards History */}
          <div className="mb-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Job Cards History
              </h2>

              <div className="mt-4">
                <JobCardHistoryTable jobCards={customer.jobCards} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
