import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import { Text } from "../components/Text";
import { ShelfTable } from "../components/shelves/ShelfTable";

// Colocated types
namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;
  export type MetaArgs = Parameters<MetaFunction>[0];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FamilyShelves - Dashboard" },
    { name: "description", content: "Manage your home inventory" },
  ];
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {/* Welcome Section */}
            <section className="flex flex-col gap-2 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <Text variant="subtitle">
                Welcome back, {user.displayName || user.email}!
              </Text>
              <Text muted>
                Start managing your home inventory and maintenance schedules.
              </Text>
            </section>

            {/* Shelves Tab View */}
            <section className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
              <ShelfTable />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
