import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import { Text } from "../components/Text";
import { ShelfTable } from "../components/shelves/ShelfTable";
import { ShelfTabs } from "~/components/shelves/ShelfTabs";
import { useState } from "react";
import type { Shelf } from "~/DB/auth";

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
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
  const [isAddShelfModalOpen, setIsAddShelfModalOpen] = useState(false);

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
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <section className="flex flex-col gap-2 p-2">
          <Text variant="subtitle">
            Welcome back, {user.displayName || user.email}!
          </Text>
          <Text muted>
            Start managing your home inventory and maintenance schedules.
          </Text>
        </section>

        <section className="flex flex-col gap-2 border-t pt-2 border-slate-200 dark:border-slate-800 scrollbar-hide">
          <Text centered variant="subtitle">
            Your shelves
          </Text>
          <ShelfTabs
            shelves={shelves}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id)}
            onAddClick={() => setIsAddShelfModalOpen(true)}
            onDeleteClick={setShelfToDelete}
          />

          <ShelfTable
            shelves={shelves}
            setShelves={setShelves}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            shelfToDelete={shelfToDelete}
            setShelfToDelete={setShelfToDelete}
            isAddShelfModalOpen={isAddShelfModalOpen}
            setIsAddShelfModalOpen={setIsAddShelfModalOpen}
          />
        </section>
      </div>
    </div>
  );
}
