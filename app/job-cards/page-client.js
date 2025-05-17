"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import ClientFilteredJobCardListWithParams from "../components/ClientFilteredJobCardListWithParams";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function JobCardsPageClient() {
  const { status } = useSession();
  const router = useRouter();
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      // Fetch job cards
      const fetchJobCards = async () => {
        try {
          const response = await fetch("/api/job-cards?limit=1000");
          if (response.ok) {
            const data = await response.json();
            setJobCards(data.jobCards || []);
          }
        } catch (error) {
          console.error("Error fetching job cards:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobCards();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-0">
            Job Cards
          </h1>
        </div>

        <ClientFilteredJobCardListWithParams
          jobCards={jobCards}
          initialStatus="all"
          initialPage={1}
          initialPageSize={5}
          showStatusFilter={true}
        />
      </div>
    </Layout>
  );
}
