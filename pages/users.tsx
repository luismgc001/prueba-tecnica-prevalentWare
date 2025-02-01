import { useState } from 'react';
import Link from 'next/link';

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '', role: '' });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = () => {
    // Logic to save the edited user (placeholder for now)
    console.log("User saved!", selectedUser);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-100 p-4">
        <h1 className="mb-8 text-xl font-bold">LOGO</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/movements">Ingresos y egresos</Link>
            </li>
            <li className="mb-4">
              <Link href="/users">Usuarios</Link>
            </li>
            <li>
              <Link href="/reports">Reportes</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 p-8">
        <h2 className="text-2xl font-bold">Gestión de usuarios</h2>
        <div className="mt-8">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Correo</th>
                <th className="border border-gray-300 px-4 py-2">Teléfono</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row; replace with dynamic data */}
              <tr>
                <td className="border border-gray-300 px-4 py-2">John Doe</td>
                <td className="border border-gray-300 px-4 py-2">john@example.com</td>
                <td className="border border-gray-300 px-4 py-2">123456789</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => handleEdit({ name: 'John Doe', role: 'Admin' })}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-md shadow-lg p-8 w-1/2">
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Rol</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
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
    </div>
  );
}