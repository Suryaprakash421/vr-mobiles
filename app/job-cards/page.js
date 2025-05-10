import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Layout from "../components/Layout";
import JobCardList from "../components/JobCardList";
import SearchBar from "../components/SearchBar";

export default async function JobCardsPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get search parameter safely
  const { search: searchParam } = searchParams || {};
  const search = searchParam ? String(searchParam) : "";

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

  const jobCards = await prisma.jobCard.findMany({
    where: whereClause,
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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-0">
            Job Cards
          </h1>
        </div>

        {search && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800">
              Search results for: <strong>{search}</strong> ({jobCards.length}{" "}
              results)
            </p>
          </div>
        )}

        <JobCardList jobCards={jobCards} />
      </div>
    </Layout>
  );
}
