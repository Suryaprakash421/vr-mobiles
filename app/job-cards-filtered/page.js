import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "../../lib/prisma";
import Layout from "../components/Layout";
import JobCardList from "../components/JobCardList";

export default async function JobCardsFilteredPage(props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get pagination, search, and status filter parameters safely
  const searchParams = props.searchParams || {};

  // Extract parameters with fallbacks
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const status = searchParams.status || "all";

  console.log("Status parameter:", status);
  console.log("Raw searchParams:", JSON.stringify(searchParams));

  // Calculate pagination offsets
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let whereClause = {};

  // If search parameter exists, add it to the where clause
  if (search) {
    whereClause = {
      OR: [
        { billNo: isNaN(parseInt(search)) ? undefined : parseInt(search) },
        { customerName: { contains: search } },
        { mobileNumber: { contains: search } },
        { model: { contains: search } },
      ].filter(Boolean),
    };
  }

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

  // Get total count for pagination
  const totalCount = await prisma.jobCard.count({
    where: whereClause,
  });

  // Get paginated job cards
  const jobCards = await prisma.jobCard.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
    include: {
      createdBy: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-0">
            Filtered Job Cards
          </h1>
        </div>

        <JobCardList
          jobCards={jobCards}
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          currentStatus={status}
          showStatusFilter={true}
        />
      </div>
    </Layout>
  );
}
