import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "../../lib/prisma";
import Layout from "../components/Layout";

export default async function TestFilterPage(props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get status parameter safely
  const searchParams = props.searchParams || {};
  const status = searchParams.status || "";

  console.log("Status parameter:", status);
  console.log("All search parameters:", JSON.stringify(searchParams));

  // Create where clause
  let whereClause = {};

  // If status parameter exists, add it to the where clause
  if (status && status !== "all") {
    whereClause = {
      ...whereClause,
      status: status,
    };
    console.log(`Filtering by status: ${status}`);
    console.log(
      "Where clause with status filter:",
      JSON.stringify(whereClause)
    );
  } else {
    console.log("No status filter applied");
  }

  // Get all job cards
  const jobCards = await prisma.jobCard.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
          Test Filter Page
        </h1>
        <p className="mb-4">
          Status parameter: <strong>{status || "none"}</strong>
        </p>
        <p className="mb-4">
          Where clause: <code>{JSON.stringify(whereClause)}</code>
        </p>
        <p className="mb-4">
          Job cards found: <strong>{jobCards.length}</strong>
        </p>

        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Filter Links</h2>
          <div className="flex space-x-4">
            <a
              href="/test-filter"
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              All
            </a>
            <a
              href="/test-filter?status=pending"
              className="px-4 py-2 bg-yellow-200 rounded-md hover:bg-yellow-300"
            >
              Pending
            </a>
            <a
              href="/test-filter?status=in-progress"
              className="px-4 py-2 bg-blue-200 rounded-md hover:bg-blue-300"
            >
              In Progress
            </a>
            <a
              href="/test-filter?status=completed"
              className="px-4 py-2 bg-green-200 rounded-md hover:bg-green-300"
            >
              Completed
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Job Cards</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobCards.map((jobCard) => (
                <tr key={jobCard.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {jobCard.billNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jobCard.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jobCard.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
