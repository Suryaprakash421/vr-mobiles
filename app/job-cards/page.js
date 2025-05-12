import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Layout from "../components/Layout";
import JobCardList from "../components/JobCardList";
// No need to import SearchBar as it's used in JobCardList component

export default async function JobCardsPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get pagination and search parameters safely
  const {
    search: searchParam,
    page: pageParam,
    pageSize: pageSizeParam,
  } = searchParams || {};

  const search = searchParam ? String(searchParam) : "";
  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 5;

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
            Job Cards
          </h1>
        </div>

        <JobCardList
          jobCards={jobCards}
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
        />
      </div>
    </Layout>
  );
}
