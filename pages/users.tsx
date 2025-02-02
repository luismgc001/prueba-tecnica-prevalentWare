import { checkAuth } from "@/lib/authHelper";
import Layout from "@/components/Layout";
import { UserTable } from "@/components/UserTable";

export async function getServerSideProps(context) {
  return checkAuth(context, { requireAdmin: true });
}

export default function Users() {
  return (
    <Layout role="Admin">
      <main className="w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Gestión de usuarios</h2>
        <UserTable />
      </main>
    </Layout>
  );
}
