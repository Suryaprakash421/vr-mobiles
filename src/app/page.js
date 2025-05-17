"use client";

import { Suspense } from "react";
import HomeClient from "./page-client";
import ForceLogin from "./components/ForceLogin";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <ForceLogin>
        <HomeClient />
      </ForceLogin>
    </Suspense>
  );
}
