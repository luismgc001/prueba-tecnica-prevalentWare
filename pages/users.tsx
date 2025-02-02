import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { checkAuth } from "@/lib/authHelper";
import Layout from "@/components/Layout";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $role: Role) {
    updateUser(id: $id, name: $name, role: $role) {
      id
      name
      role
    }
  }
`;
export async function getServerSideProps(context) {
  return checkAuth(context, { requireAdmin: true });
}

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    name: "",
    role: "",
  });
  const { data, loading, error } = useQuery(GET_USERS);
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  if (loading) {
    return (
      <Layout role="Admin">
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="Admin">
        <Alert variant="destructive">
          <AlertDescription>Error: {error.message}</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (updateLoading) return;
    try {
      await updateUser({
        variables: {
          id: selectedUser.id,
          name: selectedUser.name,
          role: selectedUser.role,
        },
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Layout role="Admin">
      <main className="w-3/4 p-8">
        <h2 className="text-2xl font-bold">Gestión de usuarios</h2>
        <div className="mt-8">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Correo</th>
                <th className="border border-gray-300 px-4 py-2">Rol</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-md shadow-lg p-8 w-1/2">
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Rol
                    </label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      required
                    >
                      <option value="">Seleccionar rol</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
