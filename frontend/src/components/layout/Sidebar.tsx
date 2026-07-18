export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        MetricMind
      </h1>

      <nav className="space-y-4">
        <button className="block w-full rounded px-2 py-2 text-left hover:bg-slate-700">
          Dashboard
        </button>

        <button className="block w-full rounded px-2 py-2 text-left hover:bg-slate-700">
          Analytics
        </button>

        <button className="block w-full rounded px-2 py-2 text-left hover:bg-slate-700">
          AI Chat
        </button>

        <button className="block w-full rounded px-2 py-2 text-left hover:bg-slate-700">
          Reports
        </button>

        <button className="block w-full rounded px-2 py-2 text-left hover:bg-slate-700">
          Settings
        </button>
      </nav>
    </aside>
  );
}