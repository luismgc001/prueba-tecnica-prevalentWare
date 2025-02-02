export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400">Cargando...</p>
    </div>
  );
}
