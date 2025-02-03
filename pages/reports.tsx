import { getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ReportsView from "@/components/ReportsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { checkAuth } from "@/lib/authHelper";
import Layout from "@/components/Layout";
import { ServerSideContext } from "@/types/components";

export async function getServerSideProps(context: ServerSideContext) {
  return checkAuth(context, { requireAdmin: true });
}

export default function Reports({ error }: { error: any }) {
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reportes Financieros</h1>
        <div className="grid gap-6">
          <ReportsView />
        </div>
      </div>
    </Layout>
  );
}
