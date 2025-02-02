import { getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ReportsView from "@/components/ReportsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { checkAuth } from "@/lib/authHelper";
import Layout from "@/components/Layout";

export async function getServerSideProps(context) {
  return checkAuth(context, { requireAdmin: true });
}

export default function Reports({ error }) {
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Layout role="Admin">
      <div className="grid grid-cols-2 gap-6">
        <ReportsView />
      </div>
    </Layout>
  );
}
