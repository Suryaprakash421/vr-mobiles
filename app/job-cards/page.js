import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "../../lib/prisma";
import Layout from "../components/Layout";
import ClientFilteredJobCardList from "../components/ClientFilteredJobCardList";
// No need to import SearchBar as it's used in the component

export default async function JobCardsPage(props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get search parameter for initial state
  const searchParams = props.searchParams || {};
  const initialSearch = searchParams.search || "";
  const initialPage = parseInt(searchParams.page || "1");
  const initialPageSize = parseInt(searchParams.pageSize || "5");
  const initialStatus = searchParams.status || "all";

  // Get all job cards (no pagination or filtering)
  const jobCards = await prisma.jobCard.findMany({
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

        <ClientFilteredJobCardList
          jobCards={jobCards}
          initialStatus={initialStatus}
          initialPage={initialPage}
          initialPageSize={initialPageSize}
          showStatusFilter={true}
        />
      </div>
    </Layout>
  );
}
